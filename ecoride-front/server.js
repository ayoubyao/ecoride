const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, 'dist');

app.use(express.static(DIST_DIR));

// Redirige toutes les routes vers index.html (React Router support)
app.get('*', (req, res) => {
  res.sendFile(path.join(DIST_DIR, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
