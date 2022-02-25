import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { View, Text, StyleSheet,  Alert } from 'react-native';
import { SOCKET } from '@env'
import { Board, BoardRepository } from 'react-native-draganddrop-board'
import { Issue } from './src/models/issue';

const boardDataTemplate = [
  {
    id: 1,
    name: 'SELECTED',
    rows: []
  }
];

export default function App() {
  let boardRepository = new BoardRepository([]);

  const [boardData, setBoardData] = useState(boardDataTemplate);

  useEffect(() => {
    const socket = io.connect(SOCKET, {
      transports: ['websocket'],
      forceNew: true,
      reconnectionAttempts: 100,
    });

    socket.on('selectIssue', (issue) => handleIssueSelection(JSON.parse(issue), true));
    socket.on('unselectIssue', (issue) => handleIssueSelection(JSON.parse(issue), false));
  }, []);

  useEffect(() => {
    boardRepository.updateData(boardData); 
  }, [boardData]);

  onIssueTouched = (issue) => {
    let description = issue.description ?? "";

    if (issue.label !== '') {
      description += "\n\nLabel : " + issue.label
    }

    if (issue.assigneeName) {
      description += "\n\nAssigné à : " + issue.assigneeName
    }

    Alert.alert( 
      issue.id + "  " + issue.name,
      description,
    ) 
  }

  handleIssueSelection = async (issue, select) => {
    let data = [...boardData];
    if (select) {
      console.log("Selecting issue #" + issue.number);
      data[0].rows.push(new Issue(issue.name, issue.description, issue.number, issue.moscow, issue.assignee));
    } else {
      console.log("Unselecting issue #" + issue.number);
      data[0].rows = data[0].rows.filter(selectedIssue => selectedIssue.number !== issue.number);
    }

    setBoardData(data);
  }

  return (
    <Board
      boardRepository={boardRepository}
      open={(issue) => this.onIssueTouched(issue)}
      boardBackground='black'
      onDragEnd={() => {}}
      cardContent={(issue) => (
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.textCardId}>{issue.id}</Text>
            <Text numberOfLines={1} style={styles.textCard}>{issue.name}</Text>
          </View>

          <View style={[styles.label, {borderColor: issue.textColor, backgroundColor: issue.backgroundColor, display: issue.displayLabel}]}>
            <Text style={[styles.textLabel, {color: issue.textColor}]}>{issue.label}</Text>
          </View>
        </View>
      )}
    />
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection:'row'
  },
  card: {
    fontWeight: '400',
    fontSize: 20,
    padding: 10,
    borderRadius: 15,
    backgroundColor: 'white',
    textAlign: "left",
    color: "#4734D3",
    margin: 10,
    borderColor: '#4734D3',
    borderWidth: 0.5
  },
  text: {
    textAlign: 'left',
  },
  textAssignee: {
    marginLeft: 5,
    alignSelf: 'center',
    textAlign: 'left',
    fontStyle: 'italic',
    fontSize: 20,
    color: 'grey',
    fontWeight: '300'
  },
  textCard: {
    marginRight: 20,
    color: "#4734D3",
    fontWeight: '400',
    fontSize: 20,
  },
  textCardId: {
    marginRight: 5,
    alignSelf: 'center',
    color: "#8B949E",
    fontWeight: '300',
    fontSize: 20,
  },
  textTitle: {
    color: "#4734D3",
    fontWeight: '400',
    fontSize: 30,
  },
  textDescription: {
    marginBottom: 100,
    marginTop: 10,
    fontWeight: '300',
    fontSize: 20,
    color: 'black'
  },
  textButton: {
    marginHorizontal: 20,
    textAlign: "center",
    color: 'white'
  },
  textLabel: {
    color: 'white',
    flexShrink: 1
  },
  label: {
    marginVertical: 5,
    alignSelf: 'flex-start',
    paddingVertical: 5,
    paddingHorizontal: 10,
    elevation: 2,
    textAlign: "center",
    borderRadius: 20,
    borderWidth: 1
  },
  scrollview: {
    marginHorizontal: 30,
    marginTop: 30
  },
  button: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 1,
    backgroundColor: "#4734D3",
    borderRadius: 30,
    padding: 15,
    elevation: 2,
    marginHorizontal: 50,
    marginBottom: 30
  },
  modal: {
    flexDirection:'row',
    flex: 1,
    backgroundColor: "white",
    borderRadius: 20,
    alignItems: "center",
    shadowRadius: 4,
    elevation: 5
  },
})
