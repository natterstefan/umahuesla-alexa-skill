from setuptools import setup, find_packages

requires = [
    'crate',
    'gevent',
    'graphene',
    'gTTS',
    'jinja2',
    'pyramid',
    'pyramid_tm',
    'python-dateutil',
    'python-twitter',
    'pytz',
    'sqlalchemy',
    'webob-graphql',
    'zope.sqlalchemy',
]


setup(
    name='umahuesla-alexa',
    version='0.0.1',
    packages=find_packages('python'),
    package_dir={'': 'python'},
    zip_safe=False,
    include_package_data=True,
    install_requires=requires,
    entry_points={
        'console_scripts': [
            'server=umahuesla.server:main',
            'init_db=umahuesla.scripts.init_db:main',
        ]
    }
)
