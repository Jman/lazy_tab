module.exports = function(grunt) {

    "use strict";

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        autoprefixer : {
            main : {
                options : {
                    browsers : ["chrome > 18"]
                },
                files : {
                    "source/main.min.css" : "source/main.css"
                }
            }
        },
        csso : {
            main : {
                files : {
                    "source/main.min.css" : "source/main.min.css"
                }
            }
        },
        copy : {
            main : {
                files: [
                    { expand: true, cwd: 'source', src: ['**'], dest: 'dist/' }
                ]
            }
        },
        replace : {
            dist : {
                files : [{src:'dist/manifest.json'}],
                match : {
                    '\\sLocal' : '',
                    '"version"(\\s+?):(\\s+?)".+?"' : '"version"$1:$2"<%= pkg.version %>"'
                }
            },
            source : {
                files : [{src:'source/manifest.json'}],
                match : {
                    '"version"(\\s+?):(\\s+?)".+?"' : '"version"$1:$2"<%= pkg.version %>"'
                }
            }
        },
        compress : {
            main : {
                options: {
                    archive: '<%= pkg.version %>.zip'
                },
                files : [
                    { expand: true, cwd:'dist', src: ['*'] }
                ]
            }

        },
        clean : {
            before : ['dist/main.css'],
            after : ['dist/']
        },
        jshint : {
            files : ['Gruntfile.js','source/*.js'],
            options: {
                bitwise : true,
                browser : true,
                curly   : true,
                eqeqeq  : true,
                eqnull  : true,
                strict  : true,
                newcap  : true,
                noarg   : true,
                unused  : true,
                globals: {
                    exports : true,
                    module  : false,
                    chrome  : false
                }
            }
        },
        watch: {
            css: {
                files: 'source/main.css',
                tasks: ['compile']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-csso');

    grunt.registerMultiTask('replace', 'Text replace in files', function(){
        var match = this.data.match;
        this.data.files.forEach(function(file){
            var content = grunt.file.read(file.src),
                reg = '';
            Object.keys(match).forEach(function(key){
                reg = new RegExp(grunt.template.process(key),'g');
                content = content.replace(reg, grunt.template.process(match[key]));
            });
            grunt.file.write(file.src.toString(), content);
        });

        return true;
    });

    grunt.registerTask('default', ['jshint']);
    grunt.registerTask('compile', ['autoprefixer', 'csso']);
    grunt.registerTask('deploy', ['jshint', 'compile', 'copy', 'replace', 'clean:before' , 'compress', 'clean:after']);

};