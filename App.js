import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { View, Text, StyleSheet, Modal, ScrollView, Image, Pressable } from 'react-native';
import { SOCKET } from '@env'
import { Board, BoardRepository } from 'react-native-draganddrop-board'
import { Issue } from './src/models/issue';
import Swiper from 'react-native-swiper'

const boardRepository = new BoardRepository([]);

export default function App() {
  const [boardData, setBoardData] = useState([]);
  const [selectedIssues, setSelectedIssues] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    console.log("Init"); 

    const socket = io.connect(SOCKET, {
      transports: ['websocket'],
      forceNew: false,
      reconnectionAttempts: 100,
    });
    socket.on('selectIssue', (issue) => handleIssueSelection(JSON.parse(issue), true));
    socket.on('unselectIssue', (issue) => handleIssueSelection(JSON.parse(issue), false));

    const data = [
      {
        id: 1,
        name: 'SELECTED',
        rows: []
      }
    ];
    boardRepository.updateData(data);
    setBoardData(data);
  }, []);

  useEffect(() => {
    console.log('Board reloaded');
  }, [boardData]);

  onIssueTouched = (selectedIssue) => {
    let issues = [selectedIssue];

    if (boardData[0].rows.length > 1) {
      issues = issues.concat(boardData[0].rows.filter(issue => issue.number !== selectedIssue.number));
    }

    let selectedIssues = []

    for (let i = 0; i < issues.length; i++) {
      const issue = issues[i];
      selectedIssues.push(
        <ScrollView style={styles.scrollview}>
          <View style={styles.row}>
            <Text style={[styles.text, {fontSize: 30, marginRight: 5}]}>{issue.id}</Text>

            <View style={[styles.label, {right:1, position:'absolute', alignSelf: 'center', borderColor: issue.textColor, backgroundColor: issue.backgroundColor}]}>
              <Text style={[styles.textLabel, {color: issue.textColor}]}>{issue.label}</Text>
            </View>
          </View>
          
          <Text style={[styles.text, styles.textTitle]}>{issue.name}</Text>

          <View style={[styles.row, {display: issue.displayAssignee, marginVertical:10}]}>
            <Image 
              source={{uri: issue.assigneeAvatarUrl}}  
              style={{width: 50, height: 50, borderRadius: 50/ 2}} 
            />
            <Text style={[styles.text, styles.textAssignee]}>{issue.assigneeName}</Text>
          </View>
          
          <Text style={[styles.text, styles.textDescription]}>{issue.description}</Text>
        </ScrollView>
      )
    }

    setSelectedIssues(selectedIssues);
    setShowModal(true);
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

    boardRepository.updateData(data);
    setBoardData(data);
  }

  return (
    <View>
      <Board
        boardRepository={boardRepository}
        open={(issue) => onIssueTouched(issue)}
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
      <Modal
          style={styles.modal}
          animationType="slide" 
          transparent={false}
          visible={showModal}
        >
          <Swiper style={styles.wrapper} showsButtons={true}>
            {selectedIssues}
          </Swiper>
            
          <Pressable
            style={styles.button}
            onPress={() => setShowModal(false)}
          >
            <Text style={styles.textButton}>FERMER</Text>
          </Pressable>
      </Modal>
    </View>
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
    marginBottom: 40
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
