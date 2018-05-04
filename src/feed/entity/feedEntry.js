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
            redirectionUrl: this.url
        };
    }
}

module.exports = FeedEntry;