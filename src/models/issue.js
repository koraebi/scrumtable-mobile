import { Assignee } from '../models/issue';
export class Issue {
  constructor(name, description, number, moscow, assignee) {
    this.name = name;
    this.description = description;
    this.id = '#' + number;
    this.label = moscow;
    this.displayLabel = 'flex';
    this.displayAssignee = assignee?.login ? 'flex' : 'none';
    this.assigneeAvatarUrl = assignee?.avatar_url ?? 'https://avatars.githubusercontent.com/u/54991044?s=40&v=4';
    this.assigneeName = assignee?.login ?? '';
    switch(moscow) {
      case 'Must': 
        this.textColor = '#5AA7EA';
        this.backgroundColor = '#10233B';
        break;
      case 'Should': 
        this.textColor = '#B9ABC1';
        this.backgroundColor = '#171B3A';
        break;
      case 'Could': 
        this.textColor = '#68A7CD';
        this.backgroundColor = '#10233B';
        break;
      case "Won't": 
        this.textColor = '#B4818B';
        this.backgroundColor = '#201B2A';
        break;
      default :
        this.displayLabel = 'none';
        this.textColor = 'black';
        this.backgroundColor = 'white';
    }
  }
}
