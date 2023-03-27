const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const ical = require('ical');
const iconv = require('iconv-lite');


async function fetchICS(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ICS file: ${response.statusText}`);
  }
  const content = await response.text();
  return content;
}

const app = express();
const PORT = process.env.PORT || 3000



// Set up body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));

// Set up multer middleware for handling file uploads
const upload = multer({ dest: 'uploads/' });

// Set up routes
app.get('/', (req, res) => {
  res.send(`
    <form method="post" action="/convert" enctype="multipart/form-data">
      <label>
        Convert from local file:
        <input type="file" name="file">
      </label>
      <br><br>
      <label>
        OR convert from URL:
        <input type="text" name="url">
      </label>
      <br><br>
      <button type="submit">Convert to CSV</button>
    </form>
  `);
});

app.post('/convert', upload.single('file'), async (req, res) => {
  let content;
  if (req.file) {
    // Read file content from local file
    content = fs.readFileSync(req.file.path);
    // Delete uploaded file
    fs.unlinkSync(req.file.path);
  } else if (req.body.url) {
    // Fetch file content from URL
    content = await fetchICS(req.body.url);
  } else {
    return res.status(400).send('Error: no file or URL specified.');
  }

  const events = ical.parseICS(content.toString());

  // Define headers and calculate total hours for each event
  const headers = ['Summary', 'Start Date', 'End Date', 'Start Time', 'End Time', 'Total Hours', 'participant', 'Location'];
  const rows = Object.values(events).map(event => {
    const summary = event.summary || '';
    const startDate = event.start && event.start.toLocaleDateString() || '';
    const endDate = event.end && event.end.toLocaleDateString() || '';
    const startTime = event.start && event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || '';
    const endTime = event.end && event.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || '';
    const totalHours = event.start && event.end && formatHoursMinutes(((new Date(event.end) - new Date(event.start)) / (1000 * 60 * 60))) || '';
    const participant = event.participant ; 
    const location = event.location ;
    
    
    // Return an array of values for each row
    return [summary, startDate, endDate, startTime, endTime, totalHours, participant , location];
  });

  // Add UTF-8 BOM to the beginning of the CSV data to ensure proper encoding
  let csvData = '\ufeff';

  // Convert headers and rows to CSV data
  csvData += headers.join(',') + '\n';
  csvData += rows.map(row => row.join(',')).join('\n');

  // Set headers for CSV download
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=calendar.csv');

  // Convert CSV data to buffer and send response
  const buffer = iconv.encode(csvData, 'utf8');
  res.send(buffer);
});

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})

// Helper function to format hours and minutes
function formatHoursMinutes(totalHours) {
  const hours = Math.floor(totalHours);
  const minutes = Math.round((totalHours - hours) * 60);
  return `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
}

