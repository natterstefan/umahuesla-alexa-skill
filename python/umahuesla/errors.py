class UmahueslaError(Exception):
    def __init__(self, error, **params):
        self.error = error
        self.params = params

    def buildResult(self):
        res = {
            'code': self.error.name,
            'message': self.error.value.format(**self.params),
        }
        if self.params:
            res['info'] = {
                k: v for (k, v) in self.params.items() if not k.startswith("_")
            }
        return res
