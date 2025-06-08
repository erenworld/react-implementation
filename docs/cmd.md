npm init @eslint/config@latest          
npx eslint src/index.js    
 npm install --save-dev jest         
npm install --save-dev eslint-plugin-jest   
npm install --save-dev @babel/core @babel/preset-env babel-jest


// .babelrc
{
    "presets": [
      ["@babel/preset-env", {
        "targets": {
          "node": "current"
        }
      }]
    ]
  }

// jest.config
export default {
    testEnvironment: 'node',
    transform: {
      '^.+\\.js$': 'babel-jest'
    }
  };

