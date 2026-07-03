const PoliceStation = require('../../modules/station/station.model');
const Officer = require('../../modules/officer/officer.model');
const Criminal = require('../../modules/criminal/criminal.model');
const Victim = require('../../modules/victim/victim.model');
const Case = require('../../modules/case/case.model');
const FIR = require('../../modules/fir/fir.model');
const Evidence = require('../../modules/evidence/evidence.model');
const Arrest = require('../../modules/arrest/arrest.model');

const setupAssociations = () => {
  // PoliceStation <-> Officer
  PoliceStation.hasMany(Officer, { foreignKey: 'Station_ID' });
  Officer.belongsTo(PoliceStation, { foreignKey: 'Station_ID' });

  // PoliceStation <-> Case
  PoliceStation.hasMany(Case, { foreignKey: 'Station_ID' });
  Case.belongsTo(PoliceStation, { foreignKey: 'Station_ID' });

  // Officer <-> Case
  Officer.hasMany(Case, { foreignKey: 'Officer_ID' });
  Case.belongsTo(Officer, { foreignKey: 'Officer_ID' });

  // Case <-> FIR
  Case.hasMany(FIR, { foreignKey: 'Case_ID' });
  FIR.belongsTo(Case, { foreignKey: 'Case_ID' });

  // Victim <-> FIR
  Victim.hasMany(FIR, { foreignKey: 'Victim_ID' });
  FIR.belongsTo(Victim, { foreignKey: 'Victim_ID' });

  // Case <-> Evidence
  Case.hasMany(Evidence, { foreignKey: 'Case_ID' });
  Evidence.belongsTo(Case, { foreignKey: 'Case_ID' });

  // Criminal <-> Arrest
  Criminal.hasMany(Arrest, { foreignKey: 'Criminal_ID' });
  Arrest.belongsTo(Criminal, { foreignKey: 'Criminal_ID' });

  // Case <-> Arrest
  Case.hasMany(Arrest, { foreignKey: 'Case_ID' });
  Arrest.belongsTo(Case, { foreignKey: 'Case_ID' });
};

module.exports = setupAssociations;
