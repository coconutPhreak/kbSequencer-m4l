{
 "patcher": {
  "fileversion": 1,
  "appversion": {
   "major": 8,
   "minor": 6,
   "revision": 0,
   "architecture": "x64",
   "modernui": 1
  },
  "classnamespace": "box",
  "rect": [
   100,
   100,
   900,
   520
  ],
  "openrect": [
   0,
   0,
   350,
   169
  ],
  "openinpresentation": 1,
  "default_fontsize": 10.0,
  "default_fontname": "Arial Bold",
  "gridsize": [
   8,
   8
  ],
  "boxes": [
   {
    "box": {
     "id": "midiin",
     "maxclass": "newobj",
     "patching_rect": [
      30,
      20,
      45,
      22
     ],
     "text": "midiin",
     "numinlets": 1,
     "numoutlets": 1,
     "outlettype": [
      "int"
     ]
    }
   },
   {
    "box": {
     "id": "midiout",
     "maxclass": "newobj",
     "patching_rect": [
      30,
      60,
      55,
      22
     ],
     "text": "midiout",
     "numinlets": 1,
     "numoutlets": 0,
     "outlettype": []
    }
   },
   {
    "box": {
     "id": "thisdevice",
     "maxclass": "newobj",
     "patching_rect": [
      200,
      20,
      85,
      22
     ],
     "text": "live.thisdevice",
     "numinlets": 1,
     "numoutlets": 3,
     "outlettype": [
      "bang",
      "int",
      "int"
     ]
    }
   },
   {
    "box": {
     "id": "js",
     "maxclass": "newobj",
     "patching_rect": [
      200,
      260,
      130,
      22
     ],
     "text": "js kbTakeover.js",
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      ""
     ]
    }
   },
   {
    "box": {
     "id": "lm_en",
     "maxclass": "newobj",
     "patching_rect": [
      320,
      20,
      65,
      22
     ],
     "text": "loadmess 1",
     "numinlets": 1,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "tgl_en",
     "maxclass": "toggle",
     "patching_rect": [
      320,
      60,
      24,
      24
     ],
     "presentation": 1,
     "presentation_rect": [
      10,
      24,
      20,
      20
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "outlettype": [
      "int"
     ],
     "parameter_enable": 0
    }
   },
   {
    "box": {
     "id": "pre_en",
     "maxclass": "newobj",
     "patching_rect": [
      320,
      100,
      105,
      22
     ],
     "text": "prepend enable",
     "numinlets": 1,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "c_en",
     "maxclass": "comment",
     "patching_rect": [
      350,
      60,
      140,
      20
     ],
     "presentation": 1,
     "presentation_rect": [
      34,
      24,
      140,
      20
     ],
     "text": "Takeover",
     "numinlets": 1,
     "numoutlets": 0
    }
   },
   {
    "box": {
     "id": "lm_af",
     "maxclass": "newobj",
     "patching_rect": [
      430,
      20,
      65,
      22
     ],
     "text": "loadmess 1",
     "numinlets": 1,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "tgl_af",
     "maxclass": "toggle",
     "patching_rect": [
      430,
      60,
      24,
      24
     ],
     "presentation": 1,
     "presentation_rect": [
      10,
      48,
      20,
      20
     ],
     "numinlets": 1,
     "numoutlets": 1,
     "outlettype": [
      "int"
     ],
     "parameter_enable": 0
    }
   },
   {
    "box": {
     "id": "pre_af",
     "maxclass": "newobj",
     "patching_rect": [
      430,
      100,
      105,
      22
     ],
     "text": "prepend autofocus",
     "numinlets": 1,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "c_af",
     "maxclass": "comment",
     "patching_rect": [
      460,
      60,
      140,
      20
     ],
     "presentation": 1,
     "presentation_rect": [
      34,
      48,
      140,
      20
     ],
     "text": "Only when track selected",
     "numinlets": 1,
     "numoutlets": 0
    }
   },
   {
    "box": {
     "id": "pre_st",
     "maxclass": "newobj",
     "patching_rect": [
      200,
      300,
      75,
      22
     ],
     "text": "prepend set",
     "numinlets": 1,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "msg_st",
     "maxclass": "message",
     "patching_rect": [
      200,
      340,
      300,
      22
     ],
     "presentation": 1,
     "presentation_rect": [
      10,
      104,
      330,
      22
     ],
     "text": "",
     "numinlets": 2,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "pre_ev",
     "maxclass": "newobj",
     "patching_rect": [
      520,
      300,
      75,
      22
     ],
     "text": "prepend set",
     "numinlets": 1,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "msg_ev",
     "maxclass": "message",
     "patching_rect": [
      520,
      340,
      300,
      22
     ],
     "presentation": 1,
     "presentation_rect": [
      10,
      130,
      330,
      22
     ],
     "text": "",
     "numinlets": 2,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "c_title",
     "maxclass": "comment",
     "patching_rect": [
      30,
      460,
      360,
      20
     ],
     "presentation": 1,
     "presentation_rect": [
      10,
      2,
      400,
      20
     ],
     "text": "kbSequencer \u00b7 Push takeover test   v0.22.1 \u00b7 1117.2100",
     "numinlets": 1,
     "numoutlets": 0
    }
   },
   {
    "box": {
     "id": "lm_col",
     "maxclass": "newobj",
     "patching_rect": [
      560,
      20,
      65,
      22
     ],
     "text": "loadmess 5",
     "numinlets": 1,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "num_col",
     "maxclass": "number",
     "patching_rect": [
      560,
      60,
      50,
      22
     ],
     "presentation": 1,
     "presentation_rect": [
      10,
      74,
      44,
      22
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "bang"
     ],
     "minimum": 0,
     "maximum": 127,
     "parameter_enable": 0
    }
   },
   {
    "box": {
     "id": "pre_col",
     "maxclass": "newobj",
     "patching_rect": [
      560,
      100,
      85,
      22
     ],
     "text": "prepend color",
     "numinlets": 1,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "c_col",
     "maxclass": "comment",
     "patching_rect": [
      615,
      60,
      70,
      20
     ],
     "presentation": 1,
     "presentation_rect": [
      58,
      74,
      70,
      20
     ],
     "text": "Pad colour",
     "numinlets": 1,
     "numoutlets": 0
    }
   },
   {
    "box": {
     "id": "msg_rescan",
     "maxclass": "message",
     "patching_rect": [
      660,
      140,
      60,
      22
     ],
     "presentation": 1,
     "presentation_rect": [
      190,
      24,
      58,
      22
     ],
     "text": "rescan",
     "numinlets": 2,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "msg_dump",
     "maxclass": "message",
     "patching_rect": [
      660,
      170,
      60,
      22
     ],
     "presentation": 1,
     "presentation_rect": [
      190,
      48,
      58,
      22
     ],
     "text": "dump",
     "numinlets": 2,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   }
  ],
  "lines": [
   {
    "patchline": {
     "source": [
      "midiin",
      0
     ],
     "destination": [
      "midiout",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "thisdevice",
      0
     ],
     "destination": [
      "js",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "lm_en",
      0
     ],
     "destination": [
      "tgl_en",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "tgl_en",
      0
     ],
     "destination": [
      "pre_en",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "pre_en",
      0
     ],
     "destination": [
      "js",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "lm_af",
      0
     ],
     "destination": [
      "tgl_af",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "tgl_af",
      0
     ],
     "destination": [
      "pre_af",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "pre_af",
      0
     ],
     "destination": [
      "js",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "js",
      0
     ],
     "destination": [
      "pre_st",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "pre_st",
      0
     ],
     "destination": [
      "msg_st",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "js",
      1
     ],
     "destination": [
      "pre_ev",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "pre_ev",
      0
     ],
     "destination": [
      "msg_ev",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "lm_col",
      0
     ],
     "destination": [
      "num_col",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "num_col",
      0
     ],
     "destination": [
      "pre_col",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "pre_col",
      0
     ],
     "destination": [
      "js",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "msg_rescan",
      0
     ],
     "destination": [
      "js",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "msg_dump",
      0
     ],
     "destination": [
      "js",
      0
     ]
    }
   }
  ],
  "dependency_cache": [
   {
    "name": "kbTakeover.js",
    "bootpath": ".",
    "type": "TEXT",
    "implicit": 1
   }
  ],
  "autosave": 0,
  "project": {
   "version": 1,
   "creationdate": 3590052493,
   "modificationdate": 3590052493,
   "viewrect": [
    0.0,
    0.0,
    300.0,
    500.0
   ],
   "autoorganize": 1,
   "hideprojectwindow": 1,
   "showdependencies": 1,
   "autolocalize": 0,
   "contents": {
    "patchers": {},
    "code": {
     "kbTakeover.js": {
      "kind": "javascript",
      "local": 1
     }
    }
   },
   "layout": {},
   "searchpath": {},
   "detailsvisible": 0,
   "amxdtype": 1835887981,
   "readonly": 0,
   "devpathtype": 0,
   "devpath": ".",
   "sortmode": 0,
   "viewmode": 0,
   "includepackages": 0
  }
 }
}