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
   420,
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
     "text": "js kbSequencer.js",
     "numinlets": 1,
     "numoutlets": 3,
     "outlettype": [
      "",
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
      260,
      20
     ],
     "presentation": 1,
     "presentation_rect": [
      10,
      2,
      300,
      20
     ],
     "text": "kbSequencer \u00b7 step 2: data + storage",
     "numinlets": 1,
     "numoutlets": 0
    }
   },
   {
    "box": {
     "id": "pattr",
     "maxclass": "newobj",
     "patching_rect": [
      200,
      400,
      100,
      22
     ],
     "text": "pattr kbData",
     "numinlets": 1,
     "numoutlets": 3,
     "outlettype": [
      "",
      "",
      ""
     ],
     "varname": "kbData",
     "saved_object_attributes": {
      "parameter_enable": 1,
      "parameter_mappable": 0
     },
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "kbData",
       "parameter_shortname": "kbData",
       "parameter_type": 3,
       "parameter_invisible": 1,
       "parameter_initial_enable": 0
      }
     }
    }
   },
   {
    "box": {
     "id": "t_init",
     "maxclass": "newobj",
     "patching_rect": [
      200,
      200,
      40,
      22
     ],
     "text": "t b b",
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "bang",
      "bang"
     ]
    }
   },
   {
    "box": {
     "id": "pre_restore",
     "maxclass": "newobj",
     "patching_rect": [
      200,
      440,
      95,
      22
     ],
     "text": "prepend restore",
     "numinlets": 1,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
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
   },
   {
    "box": {
     "id": "msg_testfill",
     "maxclass": "message",
     "patching_rect": [
      730,
      140,
      60,
      22
     ],
     "presentation": 1,
     "presentation_rect": [
      254,
      24,
      58,
      22
     ],
     "text": "testfill",
     "numinlets": 2,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "msg_clearall",
     "maxclass": "message",
     "patching_rect": [
      730,
      170,
      60,
      22
     ],
     "presentation": 1,
     "presentation_rect": [
      254,
      48,
      58,
      22
     ],
     "text": "clearall",
     "numinlets": 2,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "msg_palette_0",
     "maxclass": "message",
     "patching_rect": [
      800,
      140,
      60,
      22
     ],
     "presentation": 1,
     "presentation_rect": [
      318,
      24,
      58,
      22
     ],
     "text": "palette 0",
     "numinlets": 2,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "msg_palette_m1",
     "maxclass": "message",
     "patching_rect": [
      800,
      170,
      60,
      22
     ],
     "presentation": 1,
     "presentation_rect": [
      318,
      48,
      58,
      22
     ],
     "text": "palette -1",
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
      "thisdevice",
      0
     ],
     "destination": [
      "t_init",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "t_init",
      1
     ],
     "destination": [
      "pattr",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "t_init",
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
      2
     ],
     "destination": [
      "pattr",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "pattr",
      0
     ],
     "destination": [
      "pre_restore",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "pre_restore",
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
   },
   {
    "patchline": {
     "source": [
      "msg_testfill",
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
      "msg_clearall",
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
      "msg_palette_0",
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
      "msg_palette_m1",
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
    "name": "kbSequencer.js",
    "bootpath": ".",
    "type": "TEXT",
    "implicit": 1
   }
  ],
  "autosave": 0,
  "parameters": {
   "pattr": [
    "kbData",
    "kbData",
    0
   ],
   "inherited_shortname": 1
  },
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
     "kbSequencer.js": {
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