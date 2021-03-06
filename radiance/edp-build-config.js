/**
 * @file config edp-build
 * @author EFE, xiezhenzong
 */

exports.input = __dirname;

var path = require('path');
exports.output = path.resolve(__dirname, 'output');

var pageEntries = 'html,htm,phtml,tpl,vm';

exports.getProcessors = function () {
    return [
        new LessCompiler({
            files: ['src/resources/css/style.less']
        }), 
        new CssCompressor({
            exclude: ['tool/*.css']
        }),
        new JsCompressor(),
        new MD5Renamer({
            files: [
                '*.html',
                'src/resources/css/*',
                'src/resources/img/*',
                '!src/resource/img/favicon.ico'
            ],
            s: 1,
            e: 16,
            outputTemplate: '{basename}-{md5sum}{extname}',
            replacements: {
                html: {
                    tags: [
                        {tag: 'img', attribute: 'src'},
                        {
                            tag: 'link',
                            attribute: 'href',
                            condition: function (matcher) {
                                return !(/favicon\.ico/.test(matcher)) && (/href=\"src.*/.test(matcher));
                            }
                        },
                        {tag: 'script', attribute: 'src'}
                    ],
                    files: [ '*.html' ]
                },
                css: {
                    files: [ '*.css' ]
                },
                js: {
                    files: [ '*.js' ]
                }
            }
        }),
        new PathMapper({
            replacements: [
                {
                    type: 'html', tag: 'link',
                    attribute: 'href', extnames: pageEntries
                },
                {
                    type: 'html', tag: 'img',
                    attribute: 'src', extnames: pageEntries
                },
                {
                    type: 'html', tag: 'script',
                    attribute: 'src', extnames: pageEntries
                },
                {   
                    extnames: 'html', replacer: 'module-config' 
                },
                {
                    extnames: 'css,less', replacer: 'css'
                }
            ]
        }),
        new AddCopyright({
            files: [
                '*.css',
                '*.tpl',
                '*.js',
                '!tool/*',
                '!dep/**/*',
            ]
        }),
        new OutputCleaner({
            files: ['*.less']
        })
    ];
};

exports.exclude = [
    'doc',
    'test',
    'debug',
    'module.conf',
    'package.json',
    'dep/packages.manifest',
    'dep/*/*/test',
    'dep/*/*/doc',
    'dep/*/*/demo',
    'dep/*/*/tool',
    'dep/*/*/*.md',
    'dep/*/*/package.json',
    'edp-*',
    '.edpproj',
    '.svn',
    '.git',
    '.gitignore',
    '.idea',
    '.project',
    'Desktop.ini',
    'Thumbs.db',
    '.DS_Store',
    '*.tmp',
    '*.bak',
    '*.swp',
    'README',
    'copyright.txt',
    'f_admin.html',
    'f_uhome.html',
    'login.html'
];

/* eslint-disable guard-for-in */
exports.injectProcessor = function (processors) {
    for (var key in processors) {
        global[key] = processors[key];
    }
};
