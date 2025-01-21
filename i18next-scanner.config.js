module.exports = {
    input: [
      'src/**/*.{js,jsx,ts,tsx}', // Directorios y archivos a escanear
      '!node_modules/**',         // Excluye la carpeta node_modules
    ],
    output: './', // Ruta de salida para los archivos de traducción
    options: {
      func: {
        list: ['t', 'i18next.t'], // Funciones de traducción a escanear
        extensions: ['.js', '.jsx', '.ts', '.tsx'], // Extensiones a incluir
      },
      lngs: ['en', 'es'],  // Idiomas soportados
      defaultLng: 'es',          // Idioma por defecto
      ns: ['common'],            // Espacios de nombres
      defaultNs: 'common',
      resource: {
        loadPath: 'public/locales/{{lng}}/{{ns}}.json', // Ruta para cargar traducciones
        savePath: 'public/locales/{{lng}}/{{ns}}.json', // Ruta para guardar traducciones
        jsonIndent: 2,                                  // Formato de JSON
      },
      interpolation: {
        prefix: '{{',
        suffix: '}}',
      },
    },
  };
  