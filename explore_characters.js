// Explore Mode model for the Character Alignment dataset — Terrashift: Explorer's Guide.
// Edit "exploreContext" to change the narrative shown above the dataset.
// Edit "exploreGroundTruth" to change which classifications are the correct answers.
// Edit "model.labels" to change what the original broken AI was trained on.
window._pendingExploreModel = {
  version: 1,
  datasetId: 'characters',
  exploreContext: "Terrashift's Explorer's Guide AI was built to help players identify Friends, Foes, and Neutral creatures before every encounter. But something went badly wrong — the guide is labeling Boss-tier enemies as safe to approach, and players are stumbling into dangerous fights completely unprepared. Your job: trace every decision the broken model makes, find all the misclassifications, and figure out what the original designer got wrong before you rebuild it.",
  exploreGroundTruth: {
    '201': 'Friend', '202': 'Friend', '203': 'Friend', '204': 'Friend', '205': 'Friend',
    '206': 'Friend', '207': 'Friend', '208': 'Friend', '209': 'Friend', '210': 'Friend',
    '211': 'Friend', '212': 'Friend', '213': 'Friend', '214': 'Friend',
    '215': 'Foe',    '216': 'Foe',    '217': 'Foe',    '218': 'Foe',    '219': 'Foe',
    '220': 'Foe',    '221': 'Foe',    '222': 'Foe',    '223': 'Foe',    '224': 'Foe',
    '225': 'Foe',    '226': 'Foe',    '227': 'Foe',
    '228': 'Neutral', '229': 'Neutral', '230': 'Neutral', '231': 'Neutral', '232': 'Neutral',
    '233': 'Neutral', '234': 'Neutral', '235': 'Neutral', '236': 'Neutral', '237': 'Neutral',
    '238': 'Neutral', '239': 'Neutral', '240': 'Neutral'
  },
  userStories: [
    {
      id: 'ts-1',
      from: 'VexedVeteran_Grim',
      avatar: '🎮',
      subject: 'every single enemy that can talk is getting flagged as friendly. this cant be a coincidence',
      preview: "I started keeping a list after the third time it happened. Cursed Knight - Friend. Orc Warlord - Friend. Vampire Lord - Friend. They all talk...",
      body: "ok so I\'ve been playing since early access and I started keeping a list after the third time this happened to someone in my guild.\n\nCursed Knight - Friend\nOrc Warlord - Friend\nBandit Chief - Friend\nShadow Witch - Friend\nVampire Lord - Friend\n\ndo you see it?? they all talk. every single one of them. I went through the whole creature list and checked - if it can speak, the guide calls it a Friend. every time. no exceptions.\n\nbut then the creatures that CANT talk, like the Wise Owl or the Baby Dragon, those get rated Neutral or worse even though they\'re harmless.\n\nso whoever built this thing... what examples did they actually use? because it really feels like they only trained it on village humans who happen to be friendly. of course those all talk. but that doesn\'t mean talking = safe!!\n\nmy guild has lost three members to this bug in the last two weeks. please look into it"
    },
    {
      id: 'ts-2',
      from: 'ruins_runner_K',
      avatar: '🗺️',
      subject: 'the guide said Neutral and I almost died. it was NOT neutral.',
      preview: 'Vengeful Spirit in the eastern ruins. Glowing red, making that horrible sound, coming straight at me. Guide said Neutral...',
      body: "I don\'t even know where to start with this.\n\nEastern ruins, near the collapsed tower. I scan the Vengeful Spirit with the Explorer\'s Guide. It says Neutral.\n\nNEUTRAL.\n\nThis thing was glowing red. It was making that horrible wailing sound. It was floating DIRECTLY toward me. I almost put my weapon away because the guide said neutral and I thought maybe I was misreading the situation.\n\nI didn\'t put my weapon away. Good thing, because it attacked immediately.\n\nAfterward I was thinking about why the guide got it so wrong, and I think I figured it out? The Spirit isn\'t aggressive exactly, it\'s more like... threatening? Menacing? There\'s a difference. But the guide seems to only care about whether something is straight-up Aggressive. If it\'s a different kind of dangerous, the guide just goes \'eh, probably fine.\'\n\nI run ruins for a living. I know Menacing when I see it. The guide should too.\n\nPlease fix this before someone who\'s less experienced than me gets killed by it."
    },
    {
      id: 'ts-3',
      from: 'GuildLeader_Thessaly',
      avatar: '⚔️',
      subject: 'can someone explain to me why the Wandering Mage is a Friend??',
      preview: "My new recruit asked me to explain the Friend rating on the Wandering Mage. I opened my mouth and realized I had absolutely no idea...",
      body: "So I was running my new recruit through the Forest zone and she asked me to explain how the Explorer\'s Guide works. Great teaching moment, right?\n\nWe scan the Wandering Mage. Guide says: Friend.\n\nShe asks me why.\n\nAnd I just... stood there. I had no idea. It\'s a mage wandering alone in the forest with no allegiance to anyone. I\'ve had mixed experiences with them honestly - sometimes fine, sometimes not. But the guide is very confident. Friend.\n\nI tried to explain it and I couldn\'t. I don\'t know what the guide looked at. Did it look at the disposition? The territory? Does it even matter that it\'s a Human? I genuinely cannot tell you what goes into this rating.\n\nMy recruit now trusts the guide completely because \'the guild leader uses it.\' That scares me. I use it because it\'s usually right but I don\'t actually understand when it\'s wrong or why.\n\nCan you give us some way to see the reasoning? Even just \'this creature was rated Friend because it speaks\' would be something. Right now it feels like a magic 8-ball and I can\'t teach someone to use a magic 8-ball responsibly."
    }
  ],
  itemEdits: {},
  customFeatures: [],
  model: {
    question: 'What alignment is this creature?',
    labelFeature: 'alignment',
    labelValue: '',
    selectedFeatures: ['speaks', 'disposition', 'strength', 'territory'],
    labels: {
      '201': 'Friend', '203': 'Friend', '205': 'Friend', '206': 'Friend', '209': 'Friend',
      '217': 'Friend', '218': 'Friend', '225': 'Friend', '227': 'Friend',
      '231': 'Friend', '235': 'Friend',
      '215': 'Foe',   '216': 'Foe',   '219': 'Foe',   '222': 'Foe',
      '208': 'Neutral', '214': 'Neutral', '226': 'Neutral',
      '228': 'Neutral', '233': 'Neutral', '238': 'Neutral'
    },
    tree: null
  }
};
