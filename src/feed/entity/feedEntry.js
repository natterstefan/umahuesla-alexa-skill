class FeedEntry {
  constructor(id, timestamp, title, content, url = null) {
    this.id = id;
    this.timestamp = timestamp;
    this.title = title;
    this.content = content;
    this.url = url;
  }

  toBriefing() {
    return {
      uid: this.id,
      updateDate: this.timestamp.toISOString(),
      titleText: this.title,
      mainText: this.content,
      redirectionUrl: this.url,
    };
  }

  toSkill() {
    return {
      titleText: this.title,
      mainText: this.content,
    };
  }
}

module.exports = FeedEntry;
