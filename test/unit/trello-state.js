import trelloState from '../../src/trello-state';

describe('trelloState', () => {
  describe('on', () => {
    it('should return an empty array if nothing was there', () => {
      const state = trelloState.on(testData, new Date(2010, 1));
      expect(state.length).to.eql(0);
    });

    it('should rewind to the original list', () => {
      const d = new Date(Date.parse('2017-02-10T02:08:10.736Z'));
      const state = trelloState.on(testData, d);
      expect(state.length).to.eql(1);
      const card = state[0];
      expect(card.idList).to.eql('589d207faf051d1a27ac4a3e');
      expect(testData[0].idList).not.to.eql(card.idList); // ensure the original wasn't modified
      expect(card.actions.length).to.eql(1);
    });

    it('should not change anything if there is nothing to change', () => {
      const state = trelloState.on(testData, new Date(2020, 1));
      expect(state.length).to.eql(1);
      const card = state[0];
      expect(card.idList).to.eql('589d20816cffc3bce0ecb5da');
      expect(card.actions.length).to.eql(2);
    });
  });
  
  describe('findEarliest', () => {
    it('should find the earliest time after switching lists', () => {
      const earliestDate = trelloState.findEarliest(testData[0], '589d20816cffc3bce0ecb5da');
      const expected = new Date(Date.parse('2017-02-10T02:08:16.048Z'));
      expect(earliestDate).to.eql(expected);
    });
    
    it('should return created at if that was the original list', () => {
      const earliestDate = trelloState.findEarliest(testData[0], '589d207faf051d1a27ac4a3e');
      const expected = new Date(Date.parse('2017-02-10T02:08:05.736Z'));
      expect(earliestDate).to.eql(expected);
    });
    
    it('should return undefined if it never touched the list', () => {
      const earliestDate = trelloState.findEarliest(testData[0], 'fakelist');
      expect(earliestDate).to.eql(undefined);
    });
  });
  
  describe('findLast', () => {
    it('should find the last time after switching', () => {
      const lastDate = trelloState.findLast(testData[0], '589d20816cffc3bce0ecb5da');
      const expected = new Date(Date.parse('2017-02-10T02:08:16.048Z'));
      expect(lastDate).to.eql(expected);
    });
    
    it('should return the created at time if it was the original list', () => {
      const lastDate = trelloState.findLast(testData[0], '589d207faf051d1a27ac4a3e');
      const expected = new Date(Date.parse('2017-02-10T02:08:05.736Z'));
      expect(lastDate).to.eql(expected);
    });
    
    it('should return undefined if it never touched the list', () => {
      const earliestDate = trelloState.findEarliest(testData[0], 'fakelist');
      expect(earliestDate).to.eql(undefined);
    });
  });
  
  describe('cycleTime', () => {
    it('should return milliseconds between two (or more) lists', () => {
      const start = ['589d207faf051d1a27ac4a3e'];
      const end = ['589d20816cffc3bce0ecb5da'];
      const millis = trelloState.cycleTime(testData[0], start, end);
      expect(millis).to.eql(10312);
    });

    it('should return -1 if time is not determined', () => {
      const result = trelloState.cycleTime(testData[0], ['1'], ['2']);
      expect(result).to.eql(-1);
    });
  });
});


const testData = [
    {
        'id': '589d2085f9ed1262ae8ac0ea',
        'badges': {
            'votes': 0,
            'viewingMemberVoted': false,
            'subscribed': false,
            'fogbugz': '',
            'checkItems': 0,
            'checkItemsChecked': 0,
            'comments': 0,
            'attachments': 0,
            'description': false,
            'due': null,
            'dueComplete': false
        },
        'checkItemStates': [],
        'closed': false,
        'dueComplete': false,
        'dateLastActivity': '2017-02-10T02:08:31.822Z',
        'desc': '',
        'descData': null,
        'due': null,
        'email': null,
        'idBoard': '589d207a8086ace7121e4a68',
        'idChecklists': [],
        'idList': '589d20816cffc3bce0ecb5da',
        'idMembers': [],
        'idMembersVoted': [],
        'idShort': 1,
        'idAttachmentCover': null,
        'manualCoverAttachment': false,
        'labels': [
            {
                'id': '589d207aced82109ff34a2b2',
                'idBoard': '589d207a8086ace7121e4a68',
                'name': '',
                'color': 'green',
                'uses': 1
            }
        ],
        'idLabels': [
            '589d207aced82109ff34a2b2'
        ],
        'name': 'First card',
        'pos': 65535,
        'shortLink': 'qcrhGjHm',
        'shortUrl': 'https://trello.com/c/qcrhGjHm',
        'subscribed': false,
        'url': 'https://trello.com/c/qcrhGjHm/1-first-card',
        'actions': [
            {
                'id': '589d20904f69d07b2f528f2a',
                'idMemberCreator': '4f5e502aa47b75ea0c79a14a',
                'data': {
                    'listAfter': {
                        'name': 'List 2',
                        'id': '589d20816cffc3bce0ecb5da'
                    },
                    'listBefore': {
                        'name': 'List 1',
                        'id': '589d207faf051d1a27ac4a3e'
                    },
                    'board': {
                        'shortLink': 'RCZ9ytmy',
                        'name': 'Test Board',
                        'id': '589d207a8086ace7121e4a68'
                    },
                    'card': {
                        'shortLink': 'qcrhGjHm',
                        'idShort': 1,
                        'name': 'First card',
                        'id': '589d2085f9ed1262ae8ac0ea',
                        'idList': '589d20816cffc3bce0ecb5da'
                    },
                    'old': {
                        'idList': '589d207faf051d1a27ac4a3e'
                    }
                },
                'type': 'updateCard',
                'date': '2017-02-10T02:08:16.048Z',
                'memberCreator': {
                    'id': '4f5e502aa47b75ea0c79a14a',
                    'avatarHash': 'f2ba10008c9d39a96676df391a3cb4f0',
                    'fullName': 'Jason OGray',
                    'initials': 'JO',
                    'username': 'jasonogray'
                }
            },
            {
                'id': '589d2085f9ed1262ae8ac0eb',
                'idMemberCreator': '4f5e502aa47b75ea0c79a14a',
                'data': {
                    'board': {
                        'shortLink': 'RCZ9ytmy',
                        'name': 'Test Board',
                        'id': '589d207a8086ace7121e4a68'
                    },
                    'list': {
                        'name': 'List 1',
                        'id': '589d207faf051d1a27ac4a3e'
                    },
                    'card': {
                        'shortLink': 'qcrhGjHm',
                        'idShort': 1,
                        'name': 'First card',
                        'id': '589d2085f9ed1262ae8ac0ea'
                    }
                },
                'type': 'createCard',
                'date': '2017-02-10T02:08:05.736Z',
                'memberCreator': {
                    'id': '4f5e502aa47b75ea0c79a14a',
                    'avatarHash': 'f2ba10008c9d39a96676df391a3cb4f0',
                    'fullName': 'Jason OGray',
                    'initials': 'JO',
                    'username': 'jasonogray'
                }
            }
        ]
    }
];