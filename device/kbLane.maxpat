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
   120,
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
      330,
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
      150,
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
     "id": "group",
     "maxclass": "live.numbox",
     "patching_rect": [
      150,
      60,
      44,
      15
     ],
     "presentation": 1,
     "presentation_rect": [
      50,
      24,
      44,
      15
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "Group",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "Group",
       "parameter_shortname": "Group",
       "parameter_type": 1,
       "parameter_mmin": 1,
       "parameter_mmax": 16,
       "parameter_initial": [
        1
       ],
       "parameter_initial_enable": 1,
       "parameter_unitstyle": 0
      }
     }
    }
   },
   {
    "box": {
     "id": "lane",
     "maxclass": "live.menu",
     "patching_rect": [
      220,
      60,
      60,
      15
     ],
     "presentation": 1,
     "presentation_rect": [
      50,
      44,
      54,
      15
     ],
     "numinlets": 1,
     "numoutlets": 3,
     "outlettype": [
      "",
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "Lane",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "Lane",
       "parameter_shortname": "Lane",
       "parameter_type": 2,
       "parameter_enum": [
        "Kick",
        "Bass"
       ],
       "parameter_mmax": 1,
       "parameter_initial": [
        0.0
       ],
       "parameter_initial_enable": 1
      }
     }
    }
   },
   {
    "box": {
     "id": "recv",
     "maxclass": "newobj",
     "patching_rect": [
      30,
      100,
      95,
      22
     ],
     "text": "receive kbLanes",
     "numinlets": 1,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "t",
     "maxclass": "newobj",
     "patching_rect": [
      30,
      140,
      40,
      22
     ],
     "text": "t l l",
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
     "id": "match",
     "maxclass": "newobj",
     "patching_rect": [
      120,
      180,
      200,
      22
     ],
     "text": "expr ($i2 == $i4) && ($i3 == $i5)",
     "numinlets": 5,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "first",
     "maxclass": "newobj",
     "patching_rect": [
      30,
      220,
      65,
      22
     ],
     "text": "zl slice 1",
     "numinlets": 2,
     "numoutlets": 2,
     "outlettype": [
      "",
      ""
     ]
    }
   },
   {
    "box": {
     "id": "gate",
     "maxclass": "newobj",
     "patching_rect": [
      30,
      280,
      50,
      22
     ],
     "text": "gate 1 0",
     "numinlets": 2,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "heard_g",
     "maxclass": "newobj",
     "patching_rect": [
      340,
      140,
      55,
      22
     ],
     "text": "zl nth 2",
     "numinlets": 2,
     "numoutlets": 2,
     "outlettype": [
      "",
      ""
     ]
    }
   },
   {
    "box": {
     "id": "heard_l",
     "maxclass": "newobj",
     "patching_rect": [
      400,
      140,
      55,
      22
     ],
     "text": "zl nth 3",
     "numinlets": 2,
     "numoutlets": 2,
     "outlettype": [
      "",
      ""
     ]
    }
   },
   {
    "box": {
     "id": "heard_gn",
     "maxclass": "number",
     "patching_rect": [
      340,
      180,
      36,
      22
     ],
     "presentation": 1,
     "presentation_rect": [
      50,
      64,
      30,
      18
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "bang"
     ],
     "parameter_enable": 0,
     "ignoreclick": 1
    }
   },
   {
    "box": {
     "id": "heard_ln",
     "maxclass": "number",
     "patching_rect": [
      400,
      180,
      36,
      22
     ],
     "presentation": 1,
     "presentation_rect": [
      82,
      64,
      30,
      18
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "bang"
     ],
     "parameter_enable": 0,
     "ignoreclick": 1
    }
   },
   {
    "box": {
     "id": "c_title",
     "maxclass": "comment",
     "patching_rect": [
      300,
      20,
      60,
      20
     ],
     "presentation": 1,
     "presentation_rect": [
      6,
      2,
      100,
      20
     ],
     "text": "kbLane",
     "numinlets": 1,
     "numoutlets": 0
    }
   },
   {
    "box": {
     "id": "c_stamp",
     "maxclass": "comment",
     "patching_rect": [
      300,
      160,
      110,
      20
     ],
     "presentation": 1,
     "presentation_rect": [
      6,
      146,
      112,
      18
     ],
     "text": "v0.12.4 \u00b7 1115.1839",
     "numinlets": 1,
     "numoutlets": 0
    }
   },
   {
    "box": {
     "id": "c_group",
     "maxclass": "comment",
     "patching_rect": [
      300,
      60,
      40,
      20
     ],
     "presentation": 1,
     "presentation_rect": [
      6,
      22,
      44,
      18
     ],
     "text": "Group",
     "numinlets": 1,
     "numoutlets": 0
    }
   },
   {
    "box": {
     "id": "c_lane",
     "maxclass": "comment",
     "patching_rect": [
      300,
      80,
      40,
      20
     ],
     "presentation": 1,
     "presentation_rect": [
      6,
      42,
      44,
      18
     ],
     "text": "Lane",
     "numinlets": 1,
     "numoutlets": 0
    }
   },
   {
    "box": {
     "id": "c_heard",
     "maxclass": "comment",
     "patching_rect": [
      300,
      100,
      40,
      20
     ],
     "presentation": 1,
     "presentation_rect": [
      6,
      64,
      44,
      18
     ],
     "text": "Heard",
     "numinlets": 1,
     "numoutlets": 0
    }
   },
   {
    "box": {
     "id": "c_heard2",
     "maxclass": "comment",
     "patching_rect": [
      300,
      120,
      160,
      20
     ],
     "presentation": 1,
     "presentation_rect": [
      6,
      84,
      112,
      30
     ],
     "text": "group \u00b7 lane (0 kick, 1 bass)",
     "numinlets": 1,
     "numoutlets": 0
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
      "group",
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
      "lane",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "recv",
      0
     ],
     "destination": [
      "t",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "t",
      1
     ],
     "destination": [
      "match",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "group",
      0
     ],
     "destination": [
      "match",
      3
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "lane",
      0
     ],
     "destination": [
      "match",
      4
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "match",
      0
     ],
     "destination": [
      "gate",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "t",
      0
     ],
     "destination": [
      "first",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "first",
      0
     ],
     "destination": [
      "gate",
      1
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "gate",
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
      "t",
      1
     ],
     "destination": [
      "heard_g",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "t",
      1
     ],
     "destination": [
      "heard_l",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "heard_g",
      0
     ],
     "destination": [
      "heard_gn",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "heard_l",
      0
     ],
     "destination": [
      "heard_ln",
      0
     ]
    }
   }
  ],
  "dependency_cache": [],
  "autosave": 0,
  "parameters": {
   "group": [
    "Group",
    "Group",
    0
   ],
   "lane": [
    "Lane",
    "Lane",
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
    "code": {}
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