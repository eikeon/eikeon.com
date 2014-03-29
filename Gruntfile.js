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
		command: 'go install -v .'
            }
	},
        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: false
            },
            eikeon: {
                src: ['bower_components/jquery/dist/jquery.min.js', 'bower_components/bootstrap/dist/js/bootstrap.min.js', 'js/<%= bower.name %>.js'],
                dest: 'dist/static/js/<%= bower.name %>.js'
            },
            mediatorjs: {
                src: ['bower_components/jquery/dist/jquery.min.js', 'bower_components/bootstrap/dist/js/bootstrap.min.js', 'bower_components/angular/angular.min.js', 'bower_components/angular-animate/angular-animate.min.js', 'bower_components/angular-ui-bootstrap/index.js', 'bower_components/mediator/js/mediator.js'],
                dest: 'dist/static/js/mediator.js'
            }
        },
        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            eikeon: {
                files: {
                    'dist/static/js/<%= bower.name %>.min.js': ['<%= concat.eikeon.dest %>']
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
                    sourceMapFilename: 'dist/static/css/<%= pkg.name %>.css.map'
                },
                files: {
                    'dist/static/css/<%= bower.name %>.css': ['less/<%= pkg.name %>.less']
                }
            },
            compileTheme: {
                options: {
                    strictMath: true,
                    sourceMap: true,
                    outputSourceFiles: true,
                    sourceMapURL: '<%= pkg.name %>-theme.css.map',
                    sourceMapFilename: 'dist/static/css/<%= pkg.name %>-theme.css.map'
                },
                files: {
                    'dist/static/css/<%= pkg.name %>-theme.css': 'less/theme.less'
                }
            },
            minify: {
                options: {
                    cleancss: true,
                    report: 'min'
                },
                files: {
                    'dist/static/css/<%= bower.name %>.min.css': 'dist/static/css/<%= bower.name %>.css'
                }
            }
        },
        copy: {
            images: {
                files: [
                    {
                        expand: true,
                        cwd: 'images/',
                        src: ['**/*.{png,jpg,gif}'],
                        dest: 'dist/static/images/'
                    },
                    {
                        expand: true,
                        cwd: 'bower_components/mediator/',
                        src: ['images/question.png'],
                        dest: 'dist/static/'
                    },
                    {
                        src: ['templates/*', 'recipes', 'pages.json'],
                        dest: 'dist/'
                    },
                    {
			expand: true,
			cwd: 'bower_components/bootstrap/dist/',
                        src: ['fonts/*'],
                        dest: 'dist/static/'
                    }
                ]
            },
            mediator: {
                files: {
                    'dist/templates/mediator.html': 'bower_components/mediator/templates/home.html'
                }
            },
            sfiles: {
                files: [
                    {
                        expand: true,
                        cwd: 'static/',
                        src: ['robots.txt', 'favicon.ico'],
                        dest: 'dist/static/'
                    }
                ]
            }
        },
        imagemin: {
            dynamic: {
                options: {
                    optimizationLevel: 3,
                    progressive: false              
                    //cache: false
                },
                files: [{
                    expand: true,
                    cwd: 'images/',
                    src: ['**/*.{png,gif}'],
                    dest: 'dist/static/images/'
                }]
            }
        },
        pngmin: {
            compile: {
                options: {
                    ext: '.png'
                },
                files: [{
                    expand: true,
                    cwd: 'images/',
                    src: ['**/*.png'],
                    dest: 'dist/static/images/'
                }]
            }
        },
        hashres: {
            // Global options
            options: {
                // Optional. Encoding used to read/write files. Default value 'utf8'
                encoding: 'utf8',
                // Optional. Format used to name the files specified in 'files' property.
                // Default value: '${hash}.${name}.cache.${ext}'
                fileNameFormat: '${hash}~${name}.${ext}',
                // Optional. Should files be renamed or only alter the references to the files
                // Use it with '${name}.${ext}?${hash} to get perfect caching without renaming your files
                // Default value: true
                renameFiles: true
            },
            // hashres is a multitask. Here 'prod' is the name of the subtask. You can have as many as you want.
            prod: {
                // Specific options, override the global ones
                options: {
                    // You can override encoding, fileNameFormat or renameFiles
                },
                filter: 'isFile',
                // Files to hash
                src: [
                    // WARNING: These files will be renamed!
                    'dist/static/**/*.*', '!dist/static/**/*~*.*',
                    '!dist/static/fonts/*.*',
                    '!dist/static/robots.txt', '!dist/static/favicon.ico'],
                // File that refers to above files and needs to be updated with the hashed name
                dest: ['dist/templates/*.html', 'dist/recipes', 'dist/pages.json']
            }
        }
    });

    require('load-grunt-tasks')(grunt, {scope: 'devDependencies'});

    // Test task.
    grunt.registerTask('test', ['jshint']);

    // JS distribution task.
    grunt.registerTask('static-js', ['concat', 'uglify']);

    // CSS distribution task.
    grunt.registerTask('static-css', ['less']);

    // Images distribution task
    grunt.registerTask('static-fonts', ['copy']);
    grunt.registerTask('static-images', []);

    // Full distribution task.
    grunt.registerTask('static', ['static-css', 'static-js', 'static-images', 'static-fonts']);

    // Default task.
    grunt.registerTask('default', ['shell', 'test', 'static', 'hashres']);

};
