const fs = require('fs');

const code = fs.readFileSync('controllers/officerController.js', 'utf8');

const modules = {
  caseController: ['getCases', 'getCaseById', 'createCase', 'updateCase', 'deleteCase'],
  criminalController: ['getCriminals', 'getCriminalById', 'createCriminal', 'updateCriminal', 'deleteCriminal'],
  victimController: ['getVictims', 'getVictimById', 'createVictim', 'updateVictim', 'deleteVictim'],
  evidenceController: ['getEvidence', 'getEvidenceById', 'createEvidence', 'updateEvidence', 'deleteEvidence'],
  arrestController: ['getArrests', 'getArrestById', 'createArrest', 'updateArrest', 'deleteArrest'],
  firController: ['getFIRs', 'getFIRById', 'createFIR', 'updateFIR', 'deleteFIR'],
  stationController: ['getStations', 'getStationById', 'createStation', 'updateStation', 'deleteStation']
};

for (const [file, funcs] of Object.entries(modules)) {
  let newContent = `const Case = require('../models/Case');\nconst PoliceStation = require('../models/PoliceStation');\nconst Officer = require('../models/Officer');\nconst Criminal = require('../models/Criminal');\nconst Victim = require('../models/Victim');\nconst Evidence = require('../models/Evidence');\nconst Arrest = require('../models/Arrest');\nconst FIR = require('../models/FIR');\nconst { Op } = require('sequelize');\n\n`;
  
  for (const func of funcs) {
    const regex = new RegExp(`const ${func} = async \\(req, res, next\\) => \\{[\\s\\S]*?\\n\\};\\n`, 's');
    const match = code.match(regex);
    if (match) {
      newContent += match[0] + '\n';
      newContent += `exports.${func} = ${func};\n\n`;
    } else {
      console.log('Not found:', func);
    }
  }
  
  if (file === 'criminalController' || file === 'victimController') {
      const existing = fs.existsSync(`controllers/${file}.js`) ? fs.readFileSync(`controllers/${file}.js`, 'utf8') : '';
      fs.writeFileSync(`controllers/${file}.js`, existing + '\n' + newContent);
  } else {
      fs.writeFileSync(`controllers/${file}.js`, newContent);
  }
}

// Remove the extracted functions from officerController.js
let remainingCode = code;
for (const [file, funcs] of Object.entries(modules)) {
  for (const func of funcs) {
    const regex = new RegExp(`const ${func} = async \\(req, res, next\\) => \\{[\\s\\S]*?\\n\\};\\n`, 's');
    remainingCode = remainingCode.replace(regex, '');
  }
}
fs.writeFileSync('controllers/officerController.js', remainingCode);

console.log('Successfully split controller!');
