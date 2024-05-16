
function common() {

}

export function getDuration(milli){
    let minutes = Math.floor(milli / 60000);
    let hours = Math.round(minutes / 60);
    let days = Math.round(hours / 24);
  
    return (
      (days && {value: days, unit: 'days'}) ||
      (hours && {value: hours, unit: 'hours'}) ||
      {value: minutes, unit: 'minutes'}
    )
  };


export default common;