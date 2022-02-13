import { Issue } from '../models/issue';
import { API } from '@env';

export async function getSelectedIssuesFromApi() {
  try {
    const response = await fetch(API);
    return response.json();
  } catch(e) {
    console.error('Error from getSelectedIssuesFromApi() => ' + e);
  }
}

export function parseIssuesInfo(json) {
  let selectedData = [];
  
  for (let i = 0; i < json.length; i++) {
    if (json[i].selected === true) {
      selectedData.push(
        new Issue(
          json[i].name,
          json[i].description,
          json[i].number,
          json[i].moscow,
          json[i].assignee,
        ),
      );
    }
  }

  return selectedData;
}
