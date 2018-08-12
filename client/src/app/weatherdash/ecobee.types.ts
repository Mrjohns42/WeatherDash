
class Page {
  page = null;
  totalPages = null;
  pageSize = null;
  total = null;

  constructor(obj) {
    if (obj != null) {
      if (obj.hasOwnProperty('page')) { this.page = obj['page']; }
      if (obj.hasOwnProperty('totalPages')) { this.totalPages = obj['totalPages']; }
      if (obj.hasOwnProperty('pageSize')) { this.pageSize = obj['pageSize']; }
      if (obj.hasOwnProperty('total')) { this.total = obj['total']; }
    }
  }
}

class Status {
  code = null;
  message = null;

  constructor(obj) {
    if (obj != null) {
      if (obj.hasOwnProperty('code')) { this.code = obj['code']; }
      if (obj.hasOwnProperty('message')) { this.message = obj['message']; }
    }
  }
}

class Runtime {
  runtimeRev = null;
  connected = null;
  firstConnected = null;
  connectDateTime = null;
  disconnectDateTime = null;
  lastModified = null;
  lastStatusModified = null;
  runtimeDate = null;
  runtimeInterval = null;
  actualTemperature = null;
  actualHumidity = null;
  desiredHeat = null;
  desiredCool = null;
  desiredHumidity = null;
  desiredDehumidity = null;
  desiredFanMode = null;
  desiredHeatRange: number[] = null;
  desiredCoolRange: number[] = null;

  constructor(obj) {
    if (obj != null) {
      if (obj.hasOwnProperty('runtimeRev')) { this.runtimeRev = obj['runtimeRev']; }
      if (obj.hasOwnProperty('connected')) { this.connected = obj['connected']; }
      if (obj.hasOwnProperty('firstConnected')) { this.firstConnected = obj['firstConnected']; }
      if (obj.hasOwnProperty('connectDateTime')) { this.connectDateTime = obj['connectDateTime']; }
      if (obj.hasOwnProperty('disconnectDateTime')) { this.disconnectDateTime = obj['disconnectDateTime']; }
      if (obj.hasOwnProperty('lastModified')) { this.lastModified = obj['lastModified']; }
      if (obj.hasOwnProperty('lastStatusModified')) { this.lastStatusModified = obj['lastStatusModified']; }
      if (obj.hasOwnProperty('runtimeDate')) { this.runtimeDate = obj['runtimeDate']; }
      if (obj.hasOwnProperty('runtimeInterval')) { this.runtimeInterval = obj['runtimeInterval']; }
      if (obj.hasOwnProperty('actualTemperature')) { this.actualTemperature = obj['actualTemperature']; }
      if (obj.hasOwnProperty('actualHumidity')) { this.actualHumidity = obj['actualHumidity']; }
      if (obj.hasOwnProperty('desiredHeat')) { this.desiredHeat = obj['desiredHeat']; }
      if (obj.hasOwnProperty('desiredCool')) { this.desiredCool = obj['desiredCool']; }
      if (obj.hasOwnProperty('desiredHumidity')) { this.desiredHumidity = obj['desiredHumidity']; }
      if (obj.hasOwnProperty('desiredDehumidity')) { this.desiredDehumidity = obj['desiredDehumidity']; }
      if (obj.hasOwnProperty('desiredFanMode')) { this.desiredFanMode = obj['desiredFanMode']; }
      if (obj.hasOwnProperty('desiredHeatRange')) { this.desiredHeatRange = obj['desiredHeatRange']; }
      if (obj.hasOwnProperty('desiredCoolRange')) { this.desiredCoolRange = obj['desiredCoolRange']; }
    }
  }
}

class Thermostat {
  identifier = null;
  name = null;
  thermostatRev = null;
  isRegistered = null;
  modelNumber = null;
  brand = null;
  features = null;
  lastModified = null;
  thermostatTime = null;
  utcTime = null;

  runtime: Runtime = null;

  // settings:Settings = null;
  // alerts:Alert[] = null;
  // events:TEvent[] = null;
  // audio:Audio = null;
  // reminders:Reminder[] = null;
  // extendedRuntime:ExtendedRuntime = null;
  // electricity:Electricity = null;
  // devices:Device[] = null;
  // location:Location = null;
  // energy:Energy = null;
  // technician:Technician = null;
  // utility:Utility = null;
  // management:Management = null;
  // weather:Weather = null;
  // program: Program = null;
  // houseDetails:HouseDetails = null;
  // oemCfg:TherostatOemCfg = null;
  // equipmentStatus = null;
  // notificationSettings:NotificationSettings = null;
  // privacy:ThermostatPrivacy = null;
  // version:Version = null;
  // securitySettings:SecuritySettings = null;
  // remoteSensors:RemoteSensor[] = null;

  constructor(obj) {
    if (obj != null) {
      if (obj.hasOwnProperty('identifier')) { this.identifier = obj['identifier']; }
      if (obj.hasOwnProperty('name')) { this.name = obj['name']; }
      if (obj.hasOwnProperty('thermostatRev')) { this.thermostatRev = obj['thermostatRev']; }
      if (obj.hasOwnProperty('isRegistered')) { this.isRegistered = obj['isRegistered']; }
      if (obj.hasOwnProperty('modelNumber')) { this.modelNumber = obj['modelNumber']; }
      if (obj.hasOwnProperty('brand')) { this.brand = obj['brand']; }
      if (obj.hasOwnProperty('features')) { this.features = obj['features']; }
      if (obj.hasOwnProperty('lastModified')) { this.lastModified = obj['lastModified']; }
      if (obj.hasOwnProperty('thermostatTime')) { this.thermostatTime = obj['thermostatTime']; }
      if (obj.hasOwnProperty('utcTime')) { this.utcTime = obj['utcTime']; }
      if (obj.hasOwnProperty('runtime')) { this.runtime = new Runtime(obj['runtime']); }
    }
  }
}

export class EcobeeIndoor {
  status: Status = null;
  page: Page = null;
  thermostatList: Thermostat[] = null;

  constructor(obj) {
    if (obj != null) {
      if (obj.hasOwnProperty('status')) { this.status = new Status(obj['status']); }
      if (obj.hasOwnProperty('page')) { this.page = new Page(obj['page']); }
      if (obj.hasOwnProperty('thermostatList')) {
        this.thermostatList = [];
        for (const idx in obj['thermostatList']) {
          if (!idx) { continue; }
          const elem = obj['thermostatList'][idx];
          const thermostat = new Thermostat(elem);
          this.thermostatList.push(thermostat);
        }
      }
    }
  }

}
