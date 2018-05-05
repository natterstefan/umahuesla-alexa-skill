import gevent
import io
import logging
import re

from datetime import datetime
from gevent import Greenlet, sleep
from gtts import gTTS

from .blob import blobs
from .twitter import get
from .tweet import TweetModel

logger = logging.getLogger('umahuesla')


class Crawler(Greenlet):

    def run(self):
        while True:
            gevent.joinall([gevent.spawn(self.do_it)])
            sleep(120)

    def do_it(self):
        kwargs = {
            'term': '#uh18 -filter:nativeretweets'
        }
        res = get(**kwargs)
        for item in res:
            self.store(item)

    def store(self, item):
        tweet = TweetModel.get(item.id_str)
        if not tweet:
            text = re.sub(r'https?:\/\/.*[\r\n]*', '', item.full_text)
            tts = gTTS(text.replace('#', '').replace('@', ''), lang='de')
            stream = io.BytesIO()
            tts.write_to_fp(stream)
            res = blobs.create(stream)
            alexa_text = text.replace('#', '<phoneme alphabet="ipa" ph="ˈhæʃtæɡ">#</phoneme>')
            video_url = None
            if item.media:
                for i in item.media:
                    if i.type == 'video' and i.video_info:
                        bitrate = 0
                        for var in i.video_info.get('variants', []):
                            if var.get('bitrate', 0) > bitrate:
                                bitrate = var['bitrate']
                                video_url = var.get('url')
            try:
                logger.info(f"{item.user.name} - {text}")
                tweet = TweetModel(
                    uid=item.id_str,
                    update_date=datetime.fromtimestamp(item.created_at_in_seconds),
                    title_text=item.user.name,
                    main_text=alexa_text,
                    stream_id=res,
                    video_url=video_url
                )
                tweet.add_to_session()
                tweet.session.flush()
            except Exception as e:
                logging.error(e.message)
