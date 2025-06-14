const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

// Redirige toutes les routes vers index.html (React Router support)
app.use(express.static('/cloudclusters/ecoride/ecoride-front/dist',{index:"index.html"}));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
