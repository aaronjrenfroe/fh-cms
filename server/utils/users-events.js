const axios = require('axios');

const getEvents = async (id, ct_token) => {
  let url = 'https://api.mycircuitree.com/FH/Exports/ExecuteQuery.json';
  //let ct_token = 'C-rfuf3c/DjFYjAAEkPVqRAdxrxFBvFOmNRicxLQDBoZPUgZ6XJokrsEuW1knO0M9xRmacxonJ//nBffDCe4HiIQTomnKu1vBO';
  let params = [{ParameterID : 43, ParameterValue : id}];
  let settings = {
    ApiToken: ct_token,
    ExportQueryID: 242,
    QueryParameters: params 
  }
  console.log(JSON.stringify(settings, null, 2));
  let response = await axios.post(url, settings);
  let data = response.data;
  let events = JSON.parse(data.Results);

  if(events){
    // removing duplicate events caused by multiple family members attending the same event;
    let seenIDs = []; // Could use a set but I don't need it's fuctionality
    events = events.filter((event) => {
      if(seenIDs.indexOf(event.EventID) == -1){
        seenIDs.push(event.EventID);
        return true;
      }else{
        return false;
      }
    });
    return events
  }else{
    return [];
  }
}

const getEventIds = async (id, ct_token) => {
  let events = await getEvents(id, ct_token);
  let ids = events.map(event => {return event.EventID});
  return Array.from(new Set(ids));
}

const getAllEvents = async () => {
  let url = "https://api.mycircuitree.com/FH/Exports/ExecuteQuery.json"
  let params = {
    ApiToken:"C-rfuf3c/DjFYjAAEkPVqRAdxrxFBvFOmNRicxLQDBoZPUgZ6XJokrsEuW1knO0M9xRmacxonJ//nBffDCe4HiIQTomnKu1vBO",
    ExportQueryID:252,
    QueryParameters:[]
  }
  try{
    let response = await axios.post(url, params);
    let data = response.data;
    return JSON.parse(data.Results);
  }catch(error){
    console.log('Errored!!!!!');
    return error;
  }
}
module.exports = {getEvents, getEventIds, getAllEvents};