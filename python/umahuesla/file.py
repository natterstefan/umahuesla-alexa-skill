from crate.client.exceptions import DigestNotFoundException

from pyramid.exceptions import NotFound
from pyramid.view import view_config

from .blob import blobs


class FileRESTService(object):

    def __init__(self, request):
        self.request = request

    @view_config(route_name='file_api')
    def get(self):
        blob_id = self.request.matchdict['blob_id']
        try:
            f = blobs.get(blob_id)
        except DigestNotFoundException:
            raise NotFound('Blob not found')
        while True:
            try:
                self.request.response.body_file.write(next(f))
            except StopIteration:
                # it's required to encode the content_type to ascii
                # else pyramid handles binary data as text and raises an
                # encoding error
                self.request.response.content_type = 'audio/mpeg'
                return self.request.response


def includeme(config):
    config.add_route('file_api', '/v1/files/{blob_id}')
