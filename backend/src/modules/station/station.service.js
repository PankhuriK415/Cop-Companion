const PoliceStation = require('./station.model');

class StationService {
  async list() {
    const rows = await PoliceStation.findAll({ order: [['Station_Name', 'ASC']] });
    return { count: rows.length, data: rows };
  }
  async findById(id) { return PoliceStation.findByPk(id); }
  async create(data) { return PoliceStation.create(data); }
  async update(id, data) {
    const [c] = await PoliceStation.update(data, { where: { Station_ID: id } });
    if (!c) return null;
    return PoliceStation.findByPk(id);
  }
  async delete(id) { return (await PoliceStation.destroy({ where: { Station_ID: id } })) > 0; }
}
module.exports = new StationService();
