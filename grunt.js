module.exports = function(grunt) {

    "use strict";

    grunt.initConfig({
        pkg : '<json:package.json>',
        lint : {
            files : ['grunt.js','source/*.js']
        },
        copy : {
            main : {
                files : {
                    "dist/" : "source/*"
                }
            }
        },
        replace : {
            dist : {
                files : ['dist/manifest.json'],
                match : {
                    '\\sLocal' : '',
                    '"version"(\\s+?):(\\s+?)".+?"' : '"version"$1:$2"<%= pkg.version %>"'
                }
            },
            source : {
                files : ['source/manifest.json'],
                match : {
                    '"version"(\\s+?):(\\s+?)".+?"' : '"version"$1:$2"<%= pkg.version %>"'
                }
            }
        },
        compress : {
            main : {
                files : {
                    '<%= pkg.version %>.zip': 'dist/*'
                }
            }

        },
        clean : {
            main : ['dist/']
        },
        jshint : {
            options : {
                bitwise : true,
                browser : true,
                curly   : true,
                eqeqeq  : true,
                eqnull  : true,
                strict  : true,
                newcap  : true,
                noarg   : true,
                unused  : true
            },
            globals : {
                exports : true,
                module  : false,
                chrome  : false
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerMultiTask('replace', 'Text replace in files', function(){

        var match = this.data.match,
            files = grunt.file.expand(this.data.files);
        if (!this.data && !this.data.files) { return false; }
        files.map(grunt.file.read).forEach(function(data, i) {
            var file = files[i],
                content = data.toString(),
                reg = '';
            Object.keys(match).forEach(function(key){
                reg = new RegExp(grunt.template.process(key),'g');
                content = content.replace(reg, grunt.template.process(match[key]));
            });
            grunt.file.write(file, content);
        });

        return true;
    });

    grunt.registerTask('default', 'lint');
    grunt.registerTask('deploy', 'lint copy replace compress clean');

};