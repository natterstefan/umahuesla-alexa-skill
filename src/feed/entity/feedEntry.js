class FeedEntry {
  constructor(id, timestamp, title, content, url = null, videoUrl = null) {
    this.id = id;
    this.timestamp = timestamp;
    this.title = title;
    this.content = content;
    this.url = url;
    this.videoUrl = videoUrl;
  }

  toBriefing() {
    return {
      uid: this.id,
      updateDate: this.timestamp.toISOString(),
      titleText: this.title,
      mainText: this.content
        .replace('#', '<phoneme alphabet="ipa" ph="ˈhæʃtæɡ">#</phoneme>.')
        .replace(/https?:\/\/.*[\r\n]*/, ''),
      redirectionUrl: this.url,
      videoUrl: this.videoUrl,
    };
  }

  toSkill() {
    // classic alexa skill
    return {
      titleText: this.title,
      mainText: this.content,
    };
  }
}

module.exports = FeedEntry;
