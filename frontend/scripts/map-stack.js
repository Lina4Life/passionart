// Usage: node scripts/map-stack.js <minified-file> <line> <column>
// Example: node scripts/map-stack.js dist/assets/index-DvYko-YX.js 82 71752

const fs = require('fs');
const { SourceMapConsumer } = require('source-map');

async function map(minifiedFile, line, column){
  const mapFile = minifiedFile + '.map';
  if(!fs.existsSync(mapFile)){
    console.error('Source map not found:', mapFile);
    process.exit(1);
  }
  const raw = fs.readFileSync(mapFile, 'utf8');
  const consumer = await new SourceMapConsumer(raw);
  const orig = consumer.originalPositionFor({line: Number(line), column: Number(column)});
  console.log('Original position:', orig);
  consumer.destroy();
}

if(require.main===module){
  const [,,minifiedFile,line,column]=process.argv;
  if(!minifiedFile||!line||!column){
    console.error('Usage: node scripts/map-stack.js <minified-file> <line> <column>');
    process.exit(1);
  }
  map(minifiedFile,line,column).catch(err=>{console.error(err);process.exit(1)});
}
