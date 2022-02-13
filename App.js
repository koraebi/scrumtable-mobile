import React, { Component } from 'react';
import io from 'socket.io-client';
import { View, Modal, ScrollView, Text, StyleSheet, Pressable, Image } from 'react-native';
import { SOCKET } from '@env'
import { Board, BoardRepository } from 'react-native-draganddrop-board'
import { Issue } from './src/models/issue';

let issues = [];
export default class App extends Component {

  socket = io.connect(SOCKET, {
    transports: ['websocket'],
    forceNew: true,
    reconnectionAttempts: 100,
  });

  state = {
    boardRepository: new BoardRepository([]),
    showModal: false,
    selectedIssue: {}
  };

  render() {
    return (
      <View>
        <Board
          boardRepository={this.state.boardRepository}
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
        <Modal
          style={styles.modal}
          animationType="slide"
          transparent={false}
          visible={this.state.showModal}
          onRequestClose={() => {
            this.setState({
              showModal: false
            });
          }}
        >
        <ScrollView style={styles.scrollview}>
          <View style={styles.row}>
            <Text style={[styles.text, {fontSize: 30, marginRight: 5}]}>{this.state.selectedIssue.id}</Text>

            <View style={[styles.label, {display: this.state.selectedIssue.displayLabel, right:1, position:'absolute', alignSelf: 'center', borderColor: this.state.selectedIssue.textColor, backgroundColor: this.state.selectedIssue.backgroundColor}]}>
              <Text style={[styles.textLabel, {color: this.state.selectedIssue.textColor}]}>{this.state.selectedIssue.label}</Text>
            </View>
          </View>
          
          <Text style={[styles.text, styles.textTitle]}>{this.state.selectedIssue.name}</Text>

          <View style={[styles.row, {display: this.state.selectedIssue.displayAssignee, marginVertical:10}]}>
            <Image 
              source={{uri: this.state.selectedIssue.assigneeAvatarUrl}}  
              style={{width: 50, height: 50, borderRadius: 50/ 2}} 
            />
            <Text style={[styles.text, styles.textAssignee]}>{this.state.selectedIssue.assigneeName}</Text>
          </View>
          
          <Text style={[styles.text, styles.textDescription]}>{this.state.selectedIssue.description}</Text>
        </ScrollView>
          
        <Pressable
          style={styles.button}
          onPress={() => this.setState({
            showModal: false
          })}
        >
          <Text style={styles.textButton}>FERMER</Text>
        </Pressable>
      </Modal>
    </View>);
  }

  async componentDidMount() {
    this.loadBoard();

    this.socket.on('selectIssue', (issue) => this.handleIssueSelection(JSON.parse(issue), true));
    this.socket.on('unselectIssue', (issue) => this.handleIssueSelection(JSON.parse(issue), false));
  }

  async loadBoard() {
    const boardData = [
      {
        id: 1,
        name: 'SELECTED',
        rows: issues
      }
    ];

    this.setState({
      boardRepository: new BoardRepository(boardData)
    });
  }

  async handleIssueSelection(issue, select) {
    if (select) {
      issues.push(new Issue(issue.name, issue.description, issue.number, issue.moscow, issue.assignee));
    } else {
      issues = issues.filter(selectedIssue => selectedIssue.id !== issue.number);
    }

    await this.loadBoard();
  }

  async onIssueTouched(issue) {
    this.setState({
      selectedIssue: issue,
      showModal: true
    });
  }
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
