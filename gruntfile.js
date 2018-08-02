module.exports = function(grunt) {

	require("load-grunt-tasks")(grunt);

  grunt.initConfig({
    includereplace: {
      html: {
        src: "*.html", 
        dest: "build/", 
        expand: true, 
        cwd: "./resources/_html_block/"
      }
    },
    // Очищаем папку build
    clean: {
      build: ["build"]
    },
  	// Копируем файлы из папки source в папку build
  	copy: {
  		js: {
        expand: true,
        cwd: "./resources/js/",
        src: ["**"],
        dest: "./build/js/",
      },
  		img: {
  			expand: true,
  			cwd: "./resources/img/",
  			src: ["**"],
  			dest: "./build/img/"
  		},
      
      font: {
        expand: true,
        cwd: "./resources/_html_block/font/",
        src: ["**"],
        dest: "./build/font/"
      }
  	},
  	// Улучшаем LESS файл (отступы, порядок свойств и прочее)
  	csscomb: { 
  	 	style: {
  	 		expand: true,
  	 		src: ["./resources/_html_block/**/*.less"]
  	 	}
  	},
  	// Конвертируем LESS файлы в CSS
  	less: {/* Название таска */
  		style: {/*Этот ключ свой (придумываем сами). Имя конфигурации, чтобы можно написать несколько конфигураций*/
  			files: {/*Этот ключ говорит из какого файла какой настраиваем*/
          "./build/css/main.css": ["./resources/_html_block/main.less"]
  			}
  		}
  	},
  	// Добавляем префиксы
  	autoprefixer: {
  		options: {
  			browsers: ["last 15 version", "ie 11"]
  		},
  		style: {
        src: "./build/css/main.css"
  		}
  	},
  	// Объединяем медиа-выражения
  	cmq: {
  		style: {
  			files: {
          "./build/css/main.css": ["./build/css/main.css"]
  			}
  		}
  	},
  	// Минимизиурем CSS
  	cssmin: {
  		style: {
  			options: {
  				keepSpecialComments: 0,
  				report: "gzip"
  			},
  			files: {
          "./build/css/main.min.css": ["./build/css/main.css"]
  			}  			
  		}
  	},
  	// Объединяем несколько JS файлов
  	concat: {
      start: {
        src: [
          "./resources/_html_block/**/*.js"
        ],
        dest: "./build/js/script.js"
      }
    },
    // Минимизируем js файлы
    uglify: {
      start: {
        files: {
          "./build/js/script.min.js": ["./build/js/script.js"]
        }
      }
    },
    // Минимизируем html
    htmlmin: {
      options: {
        removeComments: true,
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        caseSensitive: true,
        keepClosingSlash: false
      },
      html: {
         files: [
        {
          expand: true,     // Enable dynamic expansion.
          cwd: 'build/',      // Src matches are relative to this path.
          src: ['*.html'], // Actual pattern(s) to match.
          dest: 'build/',   // Destination path prefix.
          ext: '.min.html'   // Dest filepaths will have this extension.
        }
      ]
      }
    },
  	// Отслеживаем изенения в указанных файлах и выполняем описанные действия
  	watch: {
      style: {
        files: ["./resources/_html_block/**/*.less"],
        tasks: ["style"],
        options: {
          spawn: false,
          livereload: true
        }
      },
      scripts: {
        files: ["./resources/js/*.js", "./resources/_html_block/**/*.js"],
        tasks: ["js"],
        options: {
          spawn: false,
          livereload: true
        }
      },
      images: {
        files: ["./resources/img/**"],
        tasks: ["img"],
        options: {
          spawn: false,
          livereload: true
        }
      },
      
      font: {
        files: ["./resources/_html_block/font/**"],
        tasks: ["font"],
        options: {
          spawn: false,
          livereload: true
        }
      },
      html: {
        files: ["./resources/_html_block/*.html", "./resources/_html_block/**/*.html"],
        tasks: ["includereplace:html"],
        options: {
          spawn: false,
          livereload: true
        }
      }
    }
  });

  // Мета-таск - передаем в массиве последовательность запуска тасков
   grunt.registerTask("production",[
    "clean",
    "csscomb",
    "less",
    "autoprefixer",
    "cmq",
    "cssmin",
    "concat",
    "uglify",
    "copy",
    "includereplace",
    "htmlmin"
  ]);
  grunt.registerTask("build",[
  	"clean",
		"less",
		"autoprefixer",
		"cssmin",
		"concat",
		"uglify",
		"copy",
    "includereplace",
    "htmlmin",
		"watch"
	]);
  grunt.registerTask("js",[
    "concat",
    "uglify",
    "copy:js"
  ]);

  grunt.registerTask("style",[
    "csscomb",
    "less",
    "autoprefixer",
    "cmq",
    "cssmin"
  ]);

  grunt.registerTask("img",[
    "copy:img",
    
  ]);
  grunt.registerTask("font",[
    "copy:font"
  ]);
  
}