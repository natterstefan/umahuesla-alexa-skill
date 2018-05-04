from crate import client


BLOBS_INDEX = "files"


class Blobs(object):

    def __init__(self):
        self.hosts = []
        self._connection = None
        self._container = None

    def set_hosts(self, hosts):
        self.hosts = hosts

    @property
    def connection(self):
        if self._connection is None:
            self._connection = client.connect(self.hosts)
        return self._connection

    @property
    def container(self):
        if self._container is None and self.connection:
            self._container = self.connection.get_blob_container(BLOBS_INDEX)
        return self._container

    def create(self, stream):
        """ Create a blob object and it's corresponding blob meta object
        from a byte stream.
        """
        blob_id = self.container.put(stream)
        return blob_id

    def get(self, id):
        return self.container.get(id)

blobs = Blobs()
