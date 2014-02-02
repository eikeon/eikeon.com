module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        bower: grunt.file.readJSON('bower.json'),
        banner: '/**\n' +
                '* <%= bower.name %>.js v<%= bower.version %> \n' +
                '* <%= grunt.template.today("yyyy/mm/dd") %> \n' +
                '*/\n',
	shell: {
            goinstall: {
                options: {
                    failOnError: true,
                    stdout: true,
                    execOptions: {
			cwd: '.'
                    }
		},
		command: 'go install -v ./...'
            }
	},
        clean: {
            static: ['static/<%= bower.name %>/', 'build']
        },
        ngmin: {
            eikeon: {
                src: ['js/<%= bower.name %>.js'],
                dest: 'build/js/<%= bower.name %>.annotate.js'
            },
        },
        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: false
            },
            eikeon: {
                src: ['bower_components/jquery/jquery.min.js', 'bower_components/bootstrap/dist/js/bootstrap.min.js'],
                dest: 'static/<%= bower.version %>/js/<%= bower.name %>.js'
            }
        },
        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            eikeon: {
                files: {
                    'static/<%= bower.version %>/js/<%= bower.name %>.min.js': ['<%= concat.eikeon.dest %>']
                }
            }
        },
        jshint: {
            options: {
                jshintrc: 'js/.jshintrc'
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            src: {
                src: ['js/*.js']
            },
            test: {
                src: ['js/tests/unit/*.js']
            }
        },
        less: {
            compileCore: {
                options: {
                    strictMath: true,
                    sourceMap: true,
                    outputSourceFiles: true,
                    sourceMapURL: '<%= pkg.name %>.css.map',
                    sourceMapFilename: 'dist/css/<%= pkg.name %>.css.map'
                },
                files: {
                    'static/<%= bower.version %>/css/<%= bower.name %>.css': ['less/<%= pkg.name %>.less']
                }
            },
            compileTheme: {
                options: {
                    strictMath: true,
                    sourceMap: true,
                    outputSourceFiles: true,
                    sourceMapURL: '<%= pkg.name %>-theme.css.map',
                    sourceMapFilename: 'dist/css/<%= pkg.name %>-theme.css.map'
                },
                files: {
                    'dist/css/<%= pkg.name %>-theme.css': 'less/theme.less'
                }
            },
            minify: {
                options: {
                    cleancss: true,
                    report: 'min'
                },
                files: {
                    'static/<%= bower.version %>/css/<%= bower.name %>.min.css': 'static/<%= bower.version %>/css/<%= bower.name %>.css'
                }
            }
        },
        typescript: {
            base: {
                src: ['bower_components/hue-color-converter/colorconverter.ts'],
                dest: 'build/js/colorconverter.js'
            }
        },
        copy: {
            images: {
                files: [
                    {
                        src: 'images/*',
                        dest: 'static/<%= bower.version %>/'
                    },
                    {
			expand: true,
			cwd: 'bower_components/bootstrap/dist/',
                        src: ['fonts/*'],
                        dest: 'static/<%= bower.version %>/'
                    }
                ]
            }
        }
    });

    require('load-grunt-tasks')(grunt, {scope: 'devDependencies'});

    // Test task.
    grunt.registerTask('test', ['jshint']);

    // JS distribution task.
    grunt.registerTask('static-js', ['typescript', 'ngmin', 'concat', 'uglify']); 

    // CSS distribution task.
    grunt.registerTask('static-css', ['less']);

    // Images distribution task
    grunt.registerTask('static-images', ['copy']);

    // Full distribution task.
    grunt.registerTask('static', ['clean', 'static-css', 'static-js', 'static-images']);

    // Default task.
    grunt.registerTask('default', ['shell', 'test', 'static']);

};
