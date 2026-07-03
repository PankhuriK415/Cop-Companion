const Case = require('../case/case.model');
const PoliceStation = require('../station/station.model');
const Officer = require('../officer/officer.model');
const FIR = require('../fir/fir.model');
const Arrest = require('../arrest/arrest.model');
const Evidence = require('../evidence/evidence.model');

class DashboardService {
  async getAllData() {
    const [cases, stations, officers, firs, arrests, evidences] = await Promise.all([
      Case.findAll(),
      PoliceStation.findAll(),
      Officer.findAll(),
      FIR.findAll(),
      Arrest.findAll(),
      Evidence.findAll(),
    ]);

    return {
      cases,
      stations,
      officers,
      firs,
      arrests,
      evidences,
    };
  }
}

module.exports = new DashboardService();
