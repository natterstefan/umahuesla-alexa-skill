const axios = require('axios');
const googleTTS = require('google-tts-api');

class FeedEntry {
  constructor(id, timestamp, username, content, url = null, videoUrl = null) {
    this.id = id;
    this.timestamp = timestamp;
    this.username = username;
    this.content = content;
    this.url = url;
    this.videoUrl = videoUrl;
  }

  async prepareTTS(text = '') {
    try {
      return await googleTTS(text.substr(0, 200), 'de', 1); // speed normal = 1 (default), slow = 0.24
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async prepareStreamUrl(text = '') {
    // we could improve the 'text' handling it by doing:
    // - /#(.)\S*/g ==> will remove any hashtag and the text after it until the first space
    const preparedText = encodeURIComponent(
      text.replace(/https?:\/\/.*[\r\n]*/g, '').replace(/#/g, ''),
    );

    let audioStream = null;
    try {
      audioStream = await this.prepareTTS(preparedText);

      // Google HACK: the first request will create the file, otherwise it returns 404
      await axios.get(audioStream);
      return audioStream;
    } catch (e) {
      return audioStream;
    }
  }

  prepareMainText(text = '') {
    return text
      .replace(/#/g, '<phoneme alphabet="ipa" ph="ˈhæʃtæɡ">#</phoneme>')
      .replace(/https?:\/\/.*[\r\n]*/g, '');
  }

  prepareTitleText(text = '') {
    return `Tweet von ${text}`;
  }

  toBriefing() {
    // text feed
    return {
      uid: this.id,
      updateDate: this.timestamp.toISOString(),
      titleText: this.prepareTitleText(this.username),
      mainText: this.prepareMainText(this.content),
      redirectionUrl: this.url,
    };
  }

  async toAudioBriefing() {
    // audio feed
    return {
      uid: this.id,
      updateDate: this.timestamp.toISOString(),
      titleText: this.prepareTitleText(this.username),
      mainText: this.prepareMainText(this.content),
      redirectionUrl: this.url,
      streamUrl: await this.prepareStreamUrl(this.content),
    };
  }

  async toVideoBriefing() {
    // video feed
    return {
      uid: this.id,
      updateDate: this.timestamp.toISOString(),
      titleText: this.prepareTitleText(this.username),
      mainText: this.prepareMainText(this.content),
      redirectionUrl: this.url,
      videoUrl: this.videoUrl,
      streamUrl: await this.prepareStreamUrl(this.content),
    };
  }

  toSkill() {
    // classic alexa skill
    return {
      titleText: this.prepareTitleText(this.username),
      mainText: this.prepareMainText(this.content),
    };
  }

  toVideoSkill() {
    return {
      // class alexa skill
      titleText: this.prepareTitleText(this.username),
      videoUrl: this.videoUrl,
      mainText: this.prepareMainText(this.content),
    };
  }
}

module.exports = FeedEntry;
