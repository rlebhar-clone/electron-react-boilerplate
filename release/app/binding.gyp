{
  "targets": [
    {
      "target_name": "caret",
      "conditions": [
        ['OS=="win"', {
          "sources": [ "caret.cpp" ],
          "include_dirs": [
            "<!@(node -p \"require('node-addon-api').include\")"
          ],
          "dependencies": [
            "<!(node -p \"require('node-addon-api').gyp\")"
          ],
          "cflags!": [ "-fno-exceptions" ],
          "cflags_cc!": [ "-fno-exceptions" ],
          "defines": [ "NAPI_DISABLE_CPP_EXCEPTIONS" ],
          "libraries": ["-lUser32"]
        }],
        ['OS!="win"', {
          "sources": [ "dummy.cpp" ]
        }]
      ]
    }
  ]
}