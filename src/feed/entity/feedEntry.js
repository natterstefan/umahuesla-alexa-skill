const axios = require('axios');

class FeedEntry {
  constructor(id, timestamp, title, content, url = null, videoUrl = null) {
    this.id = id;
    this.timestamp = timestamp;
    this.title = title;
    this.content = content;
    this.url = url;
    this.videoUrl = videoUrl;
  }

  prepareStreamUrl(text = '') {
    // Note: we removed ?ie=UTF-8 from the translate.google.* url
    // Alternative: /#(.)\S*/g ==> will remove any hashtag and the text after it until the first space
    const audioStream = `https://translate.google.com/translate_tts?q=${encodeURIComponent(
      text.replace(/https?:\/\/.*[\r\n]*/g, '').replace(/#/g, ''),
    )}&tl=de&client=tw-ob`;

    // Google HACK: the first request will create the file, otherwise it returns 404
    axios.get(audioStream);

    return audioStream;
  }

  prepareMainText(text = '') {
    return text
      .replace(/#/g, '<phoneme alphabet="ipa" ph="ˈhæʃtæɡ">#</phoneme>')
      .replace(/https?:\/\/.*[\r\n]*/g, '');
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
      streamUrl: this.prepareStreamUrl(this.content),
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
      streamUrl: this.prepareStreamUrl(this.content),
    };
  }

  toSkill() {
    // classic alexa skill
    return {
      titleText: this.title,
      mainText: this.prepareMainText(this.content),
    };
  }

  toVideoSkill() {
    return {
      // class alexa skill
      titleText: this.title,
      videoUrl: this.videoUrl,
      mainText: this.prepareMainText(this.content),
    };
  }
}

module.exports = FeedEntry;
