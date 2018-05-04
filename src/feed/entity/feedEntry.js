class FeedEntry {
  constructor(id, timestamp, title, content, url = null, videoUrl = null) {
    this.id = id;
    this.timestamp = timestamp;
    this.title = title;
    this.content = content;
    this.url = url;
    this.videoUrl = videoUrl;
  }

  prepareMainText(text) {
    return text
      .replace('#', '<phoneme alphabet="ipa" ph="ˈhæʃtæɡ">#</phoneme>.')
      .replace(/https?:\/\/.*[\r\n]*/, '');
  }

  toBriefing() {
    // text feed
    return {
      uid: this.id,
      updateDate: this.timestamp.toISOString(),
      titleText: this.title,
      mainText: this.prepareMainText(this.content),
      redirectionUrl: this.url,
    };
  }

  toAudioBriefing() {
    // audio feed
    return {
      uid: this.id,
      updateDate: this.timestamp.toISOString(),
      titleText: this.title,
      mainText: this.prepareMainText(this.content),
      redirectionUrl: this.url,
      streamUrl: `https://translate.google.com/translate_tts?q=${encodeURIComponent(
        this.content.replace(/https?:\/\/.*[\r\n]*/, ''),
      ).substring(0, 50)}&tl=de&client=tw-ob`,
    };
  }

  toVideoBriefing() {
    // video feed
    return {
      uid: this.id,
      updateDate: this.timestamp.toISOString(),
      titleText: this.title,
      mainText: this.prepareMainText(this.content),
      redirectionUrl: this.url,
      videoUrl: this.videoUrl,
      // ?ie=UTF-8
      streamUrl: `https://translate.google.com/translate_tts?q=${encodeURIComponent(
        this.content.replace(/https?:\/\/.*[\r\n]*/, ''),
      ).substring(0, 50)}&tl=de&client=tw-ob`,
    };
  }

  toSkill() {
    // classic alexa skill
    return {
      titleText: this.title,
      mainText: this.prepareMainText(this.content),
    };
  }
}

module.exports = FeedEntry;
