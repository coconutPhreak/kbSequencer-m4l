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
   560,
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
     "id": "recv_m",
     "maxclass": "newobj",
     "patching_rect": [
      30,
      120,
      55,
      22
     ],
     "text": "route m",
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
      110,
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
     "text": "v0.23.0 \u00b7 1119.2143",
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
   },
   {
    "box": {
     "id": "m_t",
     "maxclass": "newobj",
     "patching_rect": [
      500,
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
     "id": "m_match",
     "maxclass": "newobj",
     "patching_rect": [
      580,
      180,
      200,
      22
     ],
     "text": "expr ($i3 == $i6) && ($i4 == $i7)",
     "numinlets": 7,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "m_gate",
     "maxclass": "newobj",
     "patching_rect": [
      500,
      260,
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
     "id": "m_route",
     "maxclass": "newobj",
     "patching_rect": [
      500,
      300,
      160,
      22
     ],
     "text": "route 1 2 3 4 5 6 7 8",
     "numinlets": 1,
     "numoutlets": 9,
     "outlettype": [
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      ""
     ]
    }
   },
   {
    "box": {
     "id": "m_zero",
     "maxclass": "message",
     "patching_rect": [
      500,
      370,
      30,
      22
     ],
     "text": "0.",
     "numinlets": 2,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "js",
     "maxclass": "newobj",
     "patching_rect": [
      800,
      100,
      100,
      22
     ],
     "text": "js kbLane.js",
     "numinlets": 1,
     "numoutlets": 5,
     "outlettype": [
      "",
      "",
      "",
      "",
      ""
     ]
    }
   },
   {
    "box": {
     "id": "js_ids",
     "maxclass": "newobj",
     "patching_rect": [
      800,
      140,
      150,
      22
     ],
     "text": "route 1 2 3 4 5 6 7 8",
     "numinlets": 1,
     "numoutlets": 9,
     "outlettype": [
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      ""
     ]
    }
   },
   {
    "box": {
     "id": "js_info",
     "maxclass": "newobj",
     "patching_rect": [
      960,
      140,
      105,
      22
     ],
     "text": "send kbLaneInfo",
     "numinlets": 1,
     "numoutlets": 0,
     "outlettype": []
    }
   },
   {
    "box": {
     "id": "cmd_recv",
     "maxclass": "newobj",
     "patching_rect": [
      800,
      40,
      120,
      22
     ],
     "text": "receive kbLaneCmd",
     "numinlets": 1,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "g_pre",
     "maxclass": "newobj",
     "patching_rect": [
      900,
      60,
      85,
      22
     ],
     "text": "prepend group",
     "numinlets": 1,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "l_pre",
     "maxclass": "newobj",
     "patching_rect": [
      1000,
      60,
      80,
      22
     ],
     "text": "prepend lane",
     "numinlets": 1,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "pattr",
     "maxclass": "newobj",
     "patching_rect": [
      1100,
      40,
      120,
      22
     ],
     "text": "pattr kbLaneData",
     "numinlets": 1,
     "numoutlets": 3,
     "outlettype": [
      "",
      "",
      ""
     ],
     "varname": "kbLaneData",
     "saved_object_attributes": {
      "parameter_enable": 1,
      "parameter_mappable": 0
     },
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "kbLaneData",
       "parameter_shortname": "kbLaneData",
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
      1100,
      10,
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
      1100,
      70,
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
     "id": "in_parse",
     "maxclass": "newobj",
     "patching_rect": [
      30,
      380,
      80,
      22
     ],
     "text": "midiparse",
     "numinlets": 1,
     "numoutlets": 8,
     "outlettype": [
      "",
      "",
      "",
      "int",
      "int",
      "",
      "int",
      ""
     ]
    }
   },
   {
    "box": {
     "id": "in_t",
     "maxclass": "newobj",
     "patching_rect": [
      30,
      410,
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
     "id": "c_slots",
     "maxclass": "comment",
     "patching_rect": [
      1300,
      10,
      300,
      20
     ],
     "presentation": 1,
     "presentation_rect": [
      236,
      150,
      300,
      18
     ],
     "text": "CC \u00b7 map \u00b7 clear \u00b7 mapped parameter \u00b7 min % \u00b7 max %",
     "numinlets": 1,
     "numoutlets": 0
    }
   },
   {
    "box": {
     "id": "lbl1",
     "maxclass": "comment",
     "patching_rect": [
      500,
      500,
      20,
      20
     ],
     "presentation": 1,
     "presentation_rect": [
      236,
      4,
      14,
      16
     ],
     "text": "1",
     "numinlets": 1,
     "numoutlets": 0
    }
   },
   {
    "box": {
     "id": "cc1",
     "maxclass": "live.numbox",
     "patching_rect": [
      500,
      520,
      40,
      15
     ],
     "presentation": 1,
     "presentation_rect": [
      250,
      5,
      30,
      14
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "CC1",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "CC1",
       "parameter_shortname": "CC1",
       "parameter_type": 1,
       "parameter_mmin": 0,
       "parameter_mmax": 127,
       "parameter_initial": [
        20
       ],
       "parameter_initial_enable": 1,
       "parameter_unitstyle": 0
      }
     }
    }
   },
   {
    "box": {
     "id": "map1",
     "maxclass": "message",
     "patching_rect": [
      500,
      550,
      40,
      22
     ],
     "presentation": 1,
     "presentation_rect": [
      282,
      4,
      38,
      16
     ],
     "text": "map 1",
     "numinlets": 2,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "clr1",
     "maxclass": "message",
     "patching_rect": [
      545,
      550,
      45,
      22
     ],
     "presentation": 1,
     "presentation_rect": [
      322,
      4,
      42,
      16
     ],
     "text": "clear 1",
     "numinlets": 2,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "name1",
     "maxclass": "comment",
     "patching_rect": [
      500,
      580,
      150,
      20
     ],
     "presentation": 1,
     "presentation_rect": [
      366,
      4,
      120,
      16
     ],
     "text": "-",
     "numinlets": 1,
     "numoutlets": 0,
     "varname": "name1"
    }
   },
   {
    "box": {
     "id": "min1",
     "maxclass": "live.numbox",
     "patching_rect": [
      500,
      610,
      40,
      15
     ],
     "presentation": 1,
     "presentation_rect": [
      488,
      5,
      32,
      14
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "Min1",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "Min1",
       "parameter_shortname": "Min1",
       "parameter_type": 1,
       "parameter_mmin": -100,
       "parameter_mmax": 100,
       "parameter_initial": [
        -100
       ],
       "parameter_initial_enable": 1,
       "parameter_unitstyle": 0
      }
     }
    }
   },
   {
    "box": {
     "id": "max1",
     "maxclass": "live.numbox",
     "patching_rect": [
      545,
      610,
      40,
      15
     ],
     "presentation": 1,
     "presentation_rect": [
      522,
      5,
      32,
      14
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "Max1",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "Max1",
       "parameter_shortname": "Max1",
       "parameter_type": 1,
       "parameter_mmin": -100,
       "parameter_mmax": 100,
       "parameter_initial": [
        100
       ],
       "parameter_initial_enable": 1,
       "parameter_unitstyle": 0
      }
     }
    }
   },
   {
    "box": {
     "id": "su1",
     "maxclass": "newobj",
     "patching_rect": [
      500,
      650,
      90,
      22
     ],
     "text": "unpack 0 0 0 0",
     "numinlets": 1,
     "numoutlets": 4,
     "outlettype": [
      "int",
      "int",
      "int",
      "int"
     ]
    }
   },
   {
    "box": {
     "id": "st1",
     "maxclass": "newobj",
     "patching_rect": [
      600,
      680,
      45,
      22
     ],
     "text": "+ 175",
     "numinlets": 2,
     "numoutlets": 1,
     "outlettype": [
      "int"
     ]
    }
   },
   {
    "box": {
     "id": "ccp1",
     "maxclass": "newobj",
     "patching_rect": [
      500,
      710,
      70,
      22
     ],
     "text": "pack 0 0 0",
     "numinlets": 3,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "ccr1",
     "maxclass": "newobj",
     "patching_rect": [
      500,
      740,
      60,
      22
     ],
     "text": "zl rot 2",
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
     "id": "cci1",
     "maxclass": "newobj",
     "patching_rect": [
      500,
      770,
      35,
      22
     ],
     "text": "iter",
     "numinlets": 1,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "mn1",
     "maxclass": "newobj",
     "patching_rect": [
      590,
      620,
      45,
      22
     ],
     "text": "/ 100.",
     "numinlets": 2,
     "numoutlets": 1,
     "outlettype": [
      "float"
     ]
    }
   },
   {
    "box": {
     "id": "mx1",
     "maxclass": "newobj",
     "patching_rect": [
      640,
      620,
      45,
      22
     ],
     "text": "/ 100.",
     "numinlets": 2,
     "numoutlets": 1,
     "outlettype": [
      "float"
     ]
    }
   },
   {
    "box": {
     "id": "norm1",
     "maxclass": "newobj",
     "patching_rect": [
      500,
      810,
      300,
      22
     ],
     "text": "expr ($f1 <= 64) * ($f2 + ($f3 - $f2) * 0.5 * $f1 / 64.) + ($f1 > 64) * (($f2 + $f3) * 0.5 + ($f3 - $f2) * 0.5 * ($f1 - 64) / 63.)",
     "numinlets": 3,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "im1",
     "maxclass": "newobj",
     "patching_rect": [
      500,
      880,
      90,
      22
     ],
     "text": "expr $i1 == $i3",
     "numinlets": 3,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "iv1",
     "maxclass": "newobj",
     "patching_rect": [
      500,
      910,
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
     "id": "ig1",
     "maxclass": "newobj",
     "patching_rect": [
      500,
      940,
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
     "id": "mod1",
     "maxclass": "newobj",
     "patching_rect": [
      500,
      840,
      160,
      22
     ],
     "text": "live.modulate~ @smoothing 0",
     "numinlets": 2,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "lbl2",
     "maxclass": "comment",
     "patching_rect": [
      670,
      500,
      20,
      20
     ],
     "presentation": 1,
     "presentation_rect": [
      236,
      22,
      14,
      16
     ],
     "text": "2",
     "numinlets": 1,
     "numoutlets": 0
    }
   },
   {
    "box": {
     "id": "cc2",
     "maxclass": "live.numbox",
     "patching_rect": [
      670,
      520,
      40,
      15
     ],
     "presentation": 1,
     "presentation_rect": [
      250,
      23,
      30,
      14
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "CC2",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "CC2",
       "parameter_shortname": "CC2",
       "parameter_type": 1,
       "parameter_mmin": 0,
       "parameter_mmax": 127,
       "parameter_initial": [
        21
       ],
       "parameter_initial_enable": 1,
       "parameter_unitstyle": 0
      }
     }
    }
   },
   {
    "box": {
     "id": "map2",
     "maxclass": "message",
     "patching_rect": [
      670,
      550,
      40,
      22
     ],
     "presentation": 1,
     "presentation_rect": [
      282,
      22,
      38,
      16
     ],
     "text": "map 2",
     "numinlets": 2,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "clr2",
     "maxclass": "message",
     "patching_rect": [
      715,
      550,
      45,
      22
     ],
     "presentation": 1,
     "presentation_rect": [
      322,
      22,
      42,
      16
     ],
     "text": "clear 2",
     "numinlets": 2,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "name2",
     "maxclass": "comment",
     "patching_rect": [
      670,
      580,
      150,
      20
     ],
     "presentation": 1,
     "presentation_rect": [
      366,
      22,
      120,
      16
     ],
     "text": "-",
     "numinlets": 1,
     "numoutlets": 0,
     "varname": "name2"
    }
   },
   {
    "box": {
     "id": "min2",
     "maxclass": "live.numbox",
     "patching_rect": [
      670,
      610,
      40,
      15
     ],
     "presentation": 1,
     "presentation_rect": [
      488,
      23,
      32,
      14
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "Min2",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "Min2",
       "parameter_shortname": "Min2",
       "parameter_type": 1,
       "parameter_mmin": -100,
       "parameter_mmax": 100,
       "parameter_initial": [
        -100
       ],
       "parameter_initial_enable": 1,
       "parameter_unitstyle": 0
      }
     }
    }
   },
   {
    "box": {
     "id": "max2",
     "maxclass": "live.numbox",
     "patching_rect": [
      715,
      610,
      40,
      15
     ],
     "presentation": 1,
     "presentation_rect": [
      522,
      23,
      32,
      14
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "Max2",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "Max2",
       "parameter_shortname": "Max2",
       "parameter_type": 1,
       "parameter_mmin": -100,
       "parameter_mmax": 100,
       "parameter_initial": [
        100
       ],
       "parameter_initial_enable": 1,
       "parameter_unitstyle": 0
      }
     }
    }
   },
   {
    "box": {
     "id": "su2",
     "maxclass": "newobj",
     "patching_rect": [
      670,
      650,
      90,
      22
     ],
     "text": "unpack 0 0 0 0",
     "numinlets": 1,
     "numoutlets": 4,
     "outlettype": [
      "int",
      "int",
      "int",
      "int"
     ]
    }
   },
   {
    "box": {
     "id": "st2",
     "maxclass": "newobj",
     "patching_rect": [
      770,
      680,
      45,
      22
     ],
     "text": "+ 175",
     "numinlets": 2,
     "numoutlets": 1,
     "outlettype": [
      "int"
     ]
    }
   },
   {
    "box": {
     "id": "ccp2",
     "maxclass": "newobj",
     "patching_rect": [
      670,
      710,
      70,
      22
     ],
     "text": "pack 0 0 0",
     "numinlets": 3,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "ccr2",
     "maxclass": "newobj",
     "patching_rect": [
      670,
      740,
      60,
      22
     ],
     "text": "zl rot 2",
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
     "id": "cci2",
     "maxclass": "newobj",
     "patching_rect": [
      670,
      770,
      35,
      22
     ],
     "text": "iter",
     "numinlets": 1,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "mn2",
     "maxclass": "newobj",
     "patching_rect": [
      760,
      620,
      45,
      22
     ],
     "text": "/ 100.",
     "numinlets": 2,
     "numoutlets": 1,
     "outlettype": [
      "float"
     ]
    }
   },
   {
    "box": {
     "id": "mx2",
     "maxclass": "newobj",
     "patching_rect": [
      810,
      620,
      45,
      22
     ],
     "text": "/ 100.",
     "numinlets": 2,
     "numoutlets": 1,
     "outlettype": [
      "float"
     ]
    }
   },
   {
    "box": {
     "id": "norm2",
     "maxclass": "newobj",
     "patching_rect": [
      670,
      810,
      300,
      22
     ],
     "text": "expr ($f1 <= 64) * ($f2 + ($f3 - $f2) * 0.5 * $f1 / 64.) + ($f1 > 64) * (($f2 + $f3) * 0.5 + ($f3 - $f2) * 0.5 * ($f1 - 64) / 63.)",
     "numinlets": 3,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "im2",
     "maxclass": "newobj",
     "patching_rect": [
      670,
      880,
      90,
      22
     ],
     "text": "expr $i1 == $i3",
     "numinlets": 3,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "iv2",
     "maxclass": "newobj",
     "patching_rect": [
      670,
      910,
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
     "id": "ig2",
     "maxclass": "newobj",
     "patching_rect": [
      670,
      940,
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
     "id": "mod2",
     "maxclass": "newobj",
     "patching_rect": [
      670,
      840,
      160,
      22
     ],
     "text": "live.modulate~ @smoothing 0",
     "numinlets": 2,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "lbl3",
     "maxclass": "comment",
     "patching_rect": [
      840,
      500,
      20,
      20
     ],
     "presentation": 1,
     "presentation_rect": [
      236,
      40,
      14,
      16
     ],
     "text": "3",
     "numinlets": 1,
     "numoutlets": 0
    }
   },
   {
    "box": {
     "id": "cc3",
     "maxclass": "live.numbox",
     "patching_rect": [
      840,
      520,
      40,
      15
     ],
     "presentation": 1,
     "presentation_rect": [
      250,
      41,
      30,
      14
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "CC3",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "CC3",
       "parameter_shortname": "CC3",
       "parameter_type": 1,
       "parameter_mmin": 0,
       "parameter_mmax": 127,
       "parameter_initial": [
        22
       ],
       "parameter_initial_enable": 1,
       "parameter_unitstyle": 0
      }
     }
    }
   },
   {
    "box": {
     "id": "map3",
     "maxclass": "message",
     "patching_rect": [
      840,
      550,
      40,
      22
     ],
     "presentation": 1,
     "presentation_rect": [
      282,
      40,
      38,
      16
     ],
     "text": "map 3",
     "numinlets": 2,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "clr3",
     "maxclass": "message",
     "patching_rect": [
      885,
      550,
      45,
      22
     ],
     "presentation": 1,
     "presentation_rect": [
      322,
      40,
      42,
      16
     ],
     "text": "clear 3",
     "numinlets": 2,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "name3",
     "maxclass": "comment",
     "patching_rect": [
      840,
      580,
      150,
      20
     ],
     "presentation": 1,
     "presentation_rect": [
      366,
      40,
      120,
      16
     ],
     "text": "-",
     "numinlets": 1,
     "numoutlets": 0,
     "varname": "name3"
    }
   },
   {
    "box": {
     "id": "min3",
     "maxclass": "live.numbox",
     "patching_rect": [
      840,
      610,
      40,
      15
     ],
     "presentation": 1,
     "presentation_rect": [
      488,
      41,
      32,
      14
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "Min3",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "Min3",
       "parameter_shortname": "Min3",
       "parameter_type": 1,
       "parameter_mmin": -100,
       "parameter_mmax": 100,
       "parameter_initial": [
        -100
       ],
       "parameter_initial_enable": 1,
       "parameter_unitstyle": 0
      }
     }
    }
   },
   {
    "box": {
     "id": "max3",
     "maxclass": "live.numbox",
     "patching_rect": [
      885,
      610,
      40,
      15
     ],
     "presentation": 1,
     "presentation_rect": [
      522,
      41,
      32,
      14
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "Max3",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "Max3",
       "parameter_shortname": "Max3",
       "parameter_type": 1,
       "parameter_mmin": -100,
       "parameter_mmax": 100,
       "parameter_initial": [
        100
       ],
       "parameter_initial_enable": 1,
       "parameter_unitstyle": 0
      }
     }
    }
   },
   {
    "box": {
     "id": "su3",
     "maxclass": "newobj",
     "patching_rect": [
      840,
      650,
      90,
      22
     ],
     "text": "unpack 0 0 0 0",
     "numinlets": 1,
     "numoutlets": 4,
     "outlettype": [
      "int",
      "int",
      "int",
      "int"
     ]
    }
   },
   {
    "box": {
     "id": "st3",
     "maxclass": "newobj",
     "patching_rect": [
      940,
      680,
      45,
      22
     ],
     "text": "+ 175",
     "numinlets": 2,
     "numoutlets": 1,
     "outlettype": [
      "int"
     ]
    }
   },
   {
    "box": {
     "id": "ccp3",
     "maxclass": "newobj",
     "patching_rect": [
      840,
      710,
      70,
      22
     ],
     "text": "pack 0 0 0",
     "numinlets": 3,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "ccr3",
     "maxclass": "newobj",
     "patching_rect": [
      840,
      740,
      60,
      22
     ],
     "text": "zl rot 2",
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
     "id": "cci3",
     "maxclass": "newobj",
     "patching_rect": [
      840,
      770,
      35,
      22
     ],
     "text": "iter",
     "numinlets": 1,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "mn3",
     "maxclass": "newobj",
     "patching_rect": [
      930,
      620,
      45,
      22
     ],
     "text": "/ 100.",
     "numinlets": 2,
     "numoutlets": 1,
     "outlettype": [
      "float"
     ]
    }
   },
   {
    "box": {
     "id": "mx3",
     "maxclass": "newobj",
     "patching_rect": [
      980,
      620,
      45,
      22
     ],
     "text": "/ 100.",
     "numinlets": 2,
     "numoutlets": 1,
     "outlettype": [
      "float"
     ]
    }
   },
   {
    "box": {
     "id": "norm3",
     "maxclass": "newobj",
     "patching_rect": [
      840,
      810,
      300,
      22
     ],
     "text": "expr ($f1 <= 64) * ($f2 + ($f3 - $f2) * 0.5 * $f1 / 64.) + ($f1 > 64) * (($f2 + $f3) * 0.5 + ($f3 - $f2) * 0.5 * ($f1 - 64) / 63.)",
     "numinlets": 3,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "im3",
     "maxclass": "newobj",
     "patching_rect": [
      840,
      880,
      90,
      22
     ],
     "text": "expr $i1 == $i3",
     "numinlets": 3,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "iv3",
     "maxclass": "newobj",
     "patching_rect": [
      840,
      910,
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
     "id": "ig3",
     "maxclass": "newobj",
     "patching_rect": [
      840,
      940,
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
     "id": "mod3",
     "maxclass": "newobj",
     "patching_rect": [
      840,
      840,
      160,
      22
     ],
     "text": "live.modulate~ @smoothing 0",
     "numinlets": 2,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "lbl4",
     "maxclass": "comment",
     "patching_rect": [
      1010,
      500,
      20,
      20
     ],
     "presentation": 1,
     "presentation_rect": [
      236,
      58,
      14,
      16
     ],
     "text": "4",
     "numinlets": 1,
     "numoutlets": 0
    }
   },
   {
    "box": {
     "id": "cc4",
     "maxclass": "live.numbox",
     "patching_rect": [
      1010,
      520,
      40,
      15
     ],
     "presentation": 1,
     "presentation_rect": [
      250,
      59,
      30,
      14
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "CC4",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "CC4",
       "parameter_shortname": "CC4",
       "parameter_type": 1,
       "parameter_mmin": 0,
       "parameter_mmax": 127,
       "parameter_initial": [
        23
       ],
       "parameter_initial_enable": 1,
       "parameter_unitstyle": 0
      }
     }
    }
   },
   {
    "box": {
     "id": "map4",
     "maxclass": "message",
     "patching_rect": [
      1010,
      550,
      40,
      22
     ],
     "presentation": 1,
     "presentation_rect": [
      282,
      58,
      38,
      16
     ],
     "text": "map 4",
     "numinlets": 2,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "clr4",
     "maxclass": "message",
     "patching_rect": [
      1055,
      550,
      45,
      22
     ],
     "presentation": 1,
     "presentation_rect": [
      322,
      58,
      42,
      16
     ],
     "text": "clear 4",
     "numinlets": 2,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "name4",
     "maxclass": "comment",
     "patching_rect": [
      1010,
      580,
      150,
      20
     ],
     "presentation": 1,
     "presentation_rect": [
      366,
      58,
      120,
      16
     ],
     "text": "-",
     "numinlets": 1,
     "numoutlets": 0,
     "varname": "name4"
    }
   },
   {
    "box": {
     "id": "min4",
     "maxclass": "live.numbox",
     "patching_rect": [
      1010,
      610,
      40,
      15
     ],
     "presentation": 1,
     "presentation_rect": [
      488,
      59,
      32,
      14
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "Min4",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "Min4",
       "parameter_shortname": "Min4",
       "parameter_type": 1,
       "parameter_mmin": -100,
       "parameter_mmax": 100,
       "parameter_initial": [
        -100
       ],
       "parameter_initial_enable": 1,
       "parameter_unitstyle": 0
      }
     }
    }
   },
   {
    "box": {
     "id": "max4",
     "maxclass": "live.numbox",
     "patching_rect": [
      1055,
      610,
      40,
      15
     ],
     "presentation": 1,
     "presentation_rect": [
      522,
      59,
      32,
      14
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "Max4",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "Max4",
       "parameter_shortname": "Max4",
       "parameter_type": 1,
       "parameter_mmin": -100,
       "parameter_mmax": 100,
       "parameter_initial": [
        100
       ],
       "parameter_initial_enable": 1,
       "parameter_unitstyle": 0
      }
     }
    }
   },
   {
    "box": {
     "id": "su4",
     "maxclass": "newobj",
     "patching_rect": [
      1010,
      650,
      90,
      22
     ],
     "text": "unpack 0 0 0 0",
     "numinlets": 1,
     "numoutlets": 4,
     "outlettype": [
      "int",
      "int",
      "int",
      "int"
     ]
    }
   },
   {
    "box": {
     "id": "st4",
     "maxclass": "newobj",
     "patching_rect": [
      1110,
      680,
      45,
      22
     ],
     "text": "+ 175",
     "numinlets": 2,
     "numoutlets": 1,
     "outlettype": [
      "int"
     ]
    }
   },
   {
    "box": {
     "id": "ccp4",
     "maxclass": "newobj",
     "patching_rect": [
      1010,
      710,
      70,
      22
     ],
     "text": "pack 0 0 0",
     "numinlets": 3,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "ccr4",
     "maxclass": "newobj",
     "patching_rect": [
      1010,
      740,
      60,
      22
     ],
     "text": "zl rot 2",
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
     "id": "cci4",
     "maxclass": "newobj",
     "patching_rect": [
      1010,
      770,
      35,
      22
     ],
     "text": "iter",
     "numinlets": 1,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "mn4",
     "maxclass": "newobj",
     "patching_rect": [
      1100,
      620,
      45,
      22
     ],
     "text": "/ 100.",
     "numinlets": 2,
     "numoutlets": 1,
     "outlettype": [
      "float"
     ]
    }
   },
   {
    "box": {
     "id": "mx4",
     "maxclass": "newobj",
     "patching_rect": [
      1150,
      620,
      45,
      22
     ],
     "text": "/ 100.",
     "numinlets": 2,
     "numoutlets": 1,
     "outlettype": [
      "float"
     ]
    }
   },
   {
    "box": {
     "id": "norm4",
     "maxclass": "newobj",
     "patching_rect": [
      1010,
      810,
      300,
      22
     ],
     "text": "expr ($f1 <= 64) * ($f2 + ($f3 - $f2) * 0.5 * $f1 / 64.) + ($f1 > 64) * (($f2 + $f3) * 0.5 + ($f3 - $f2) * 0.5 * ($f1 - 64) / 63.)",
     "numinlets": 3,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "im4",
     "maxclass": "newobj",
     "patching_rect": [
      1010,
      880,
      90,
      22
     ],
     "text": "expr $i1 == $i3",
     "numinlets": 3,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "iv4",
     "maxclass": "newobj",
     "patching_rect": [
      1010,
      910,
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
     "id": "ig4",
     "maxclass": "newobj",
     "patching_rect": [
      1010,
      940,
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
     "id": "mod4",
     "maxclass": "newobj",
     "patching_rect": [
      1010,
      840,
      160,
      22
     ],
     "text": "live.modulate~ @smoothing 0",
     "numinlets": 2,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "lbl5",
     "maxclass": "comment",
     "patching_rect": [
      1180,
      500,
      20,
      20
     ],
     "presentation": 1,
     "presentation_rect": [
      236,
      76,
      14,
      16
     ],
     "text": "5",
     "numinlets": 1,
     "numoutlets": 0
    }
   },
   {
    "box": {
     "id": "cc5",
     "maxclass": "live.numbox",
     "patching_rect": [
      1180,
      520,
      40,
      15
     ],
     "presentation": 1,
     "presentation_rect": [
      250,
      77,
      30,
      14
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "CC5",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "CC5",
       "parameter_shortname": "CC5",
       "parameter_type": 1,
       "parameter_mmin": 0,
       "parameter_mmax": 127,
       "parameter_initial": [
        24
       ],
       "parameter_initial_enable": 1,
       "parameter_unitstyle": 0
      }
     }
    }
   },
   {
    "box": {
     "id": "map5",
     "maxclass": "message",
     "patching_rect": [
      1180,
      550,
      40,
      22
     ],
     "presentation": 1,
     "presentation_rect": [
      282,
      76,
      38,
      16
     ],
     "text": "map 5",
     "numinlets": 2,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "clr5",
     "maxclass": "message",
     "patching_rect": [
      1225,
      550,
      45,
      22
     ],
     "presentation": 1,
     "presentation_rect": [
      322,
      76,
      42,
      16
     ],
     "text": "clear 5",
     "numinlets": 2,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "name5",
     "maxclass": "comment",
     "patching_rect": [
      1180,
      580,
      150,
      20
     ],
     "presentation": 1,
     "presentation_rect": [
      366,
      76,
      120,
      16
     ],
     "text": "-",
     "numinlets": 1,
     "numoutlets": 0,
     "varname": "name5"
    }
   },
   {
    "box": {
     "id": "min5",
     "maxclass": "live.numbox",
     "patching_rect": [
      1180,
      610,
      40,
      15
     ],
     "presentation": 1,
     "presentation_rect": [
      488,
      77,
      32,
      14
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "Min5",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "Min5",
       "parameter_shortname": "Min5",
       "parameter_type": 1,
       "parameter_mmin": -100,
       "parameter_mmax": 100,
       "parameter_initial": [
        -100
       ],
       "parameter_initial_enable": 1,
       "parameter_unitstyle": 0
      }
     }
    }
   },
   {
    "box": {
     "id": "max5",
     "maxclass": "live.numbox",
     "patching_rect": [
      1225,
      610,
      40,
      15
     ],
     "presentation": 1,
     "presentation_rect": [
      522,
      77,
      32,
      14
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "Max5",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "Max5",
       "parameter_shortname": "Max5",
       "parameter_type": 1,
       "parameter_mmin": -100,
       "parameter_mmax": 100,
       "parameter_initial": [
        100
       ],
       "parameter_initial_enable": 1,
       "parameter_unitstyle": 0
      }
     }
    }
   },
   {
    "box": {
     "id": "su5",
     "maxclass": "newobj",
     "patching_rect": [
      1180,
      650,
      90,
      22
     ],
     "text": "unpack 0 0 0 0",
     "numinlets": 1,
     "numoutlets": 4,
     "outlettype": [
      "int",
      "int",
      "int",
      "int"
     ]
    }
   },
   {
    "box": {
     "id": "st5",
     "maxclass": "newobj",
     "patching_rect": [
      1280,
      680,
      45,
      22
     ],
     "text": "+ 175",
     "numinlets": 2,
     "numoutlets": 1,
     "outlettype": [
      "int"
     ]
    }
   },
   {
    "box": {
     "id": "ccp5",
     "maxclass": "newobj",
     "patching_rect": [
      1180,
      710,
      70,
      22
     ],
     "text": "pack 0 0 0",
     "numinlets": 3,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "ccr5",
     "maxclass": "newobj",
     "patching_rect": [
      1180,
      740,
      60,
      22
     ],
     "text": "zl rot 2",
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
     "id": "cci5",
     "maxclass": "newobj",
     "patching_rect": [
      1180,
      770,
      35,
      22
     ],
     "text": "iter",
     "numinlets": 1,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "mn5",
     "maxclass": "newobj",
     "patching_rect": [
      1270,
      620,
      45,
      22
     ],
     "text": "/ 100.",
     "numinlets": 2,
     "numoutlets": 1,
     "outlettype": [
      "float"
     ]
    }
   },
   {
    "box": {
     "id": "mx5",
     "maxclass": "newobj",
     "patching_rect": [
      1320,
      620,
      45,
      22
     ],
     "text": "/ 100.",
     "numinlets": 2,
     "numoutlets": 1,
     "outlettype": [
      "float"
     ]
    }
   },
   {
    "box": {
     "id": "norm5",
     "maxclass": "newobj",
     "patching_rect": [
      1180,
      810,
      300,
      22
     ],
     "text": "expr ($f1 <= 64) * ($f2 + ($f3 - $f2) * 0.5 * $f1 / 64.) + ($f1 > 64) * (($f2 + $f3) * 0.5 + ($f3 - $f2) * 0.5 * ($f1 - 64) / 63.)",
     "numinlets": 3,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "im5",
     "maxclass": "newobj",
     "patching_rect": [
      1180,
      880,
      90,
      22
     ],
     "text": "expr $i1 == $i3",
     "numinlets": 3,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "iv5",
     "maxclass": "newobj",
     "patching_rect": [
      1180,
      910,
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
     "id": "ig5",
     "maxclass": "newobj",
     "patching_rect": [
      1180,
      940,
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
     "id": "mod5",
     "maxclass": "newobj",
     "patching_rect": [
      1180,
      840,
      160,
      22
     ],
     "text": "live.modulate~ @smoothing 0",
     "numinlets": 2,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "lbl6",
     "maxclass": "comment",
     "patching_rect": [
      1350,
      500,
      20,
      20
     ],
     "presentation": 1,
     "presentation_rect": [
      236,
      94,
      14,
      16
     ],
     "text": "6",
     "numinlets": 1,
     "numoutlets": 0
    }
   },
   {
    "box": {
     "id": "cc6",
     "maxclass": "live.numbox",
     "patching_rect": [
      1350,
      520,
      40,
      15
     ],
     "presentation": 1,
     "presentation_rect": [
      250,
      95,
      30,
      14
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "CC6",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "CC6",
       "parameter_shortname": "CC6",
       "parameter_type": 1,
       "parameter_mmin": 0,
       "parameter_mmax": 127,
       "parameter_initial": [
        25
       ],
       "parameter_initial_enable": 1,
       "parameter_unitstyle": 0
      }
     }
    }
   },
   {
    "box": {
     "id": "map6",
     "maxclass": "message",
     "patching_rect": [
      1350,
      550,
      40,
      22
     ],
     "presentation": 1,
     "presentation_rect": [
      282,
      94,
      38,
      16
     ],
     "text": "map 6",
     "numinlets": 2,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "clr6",
     "maxclass": "message",
     "patching_rect": [
      1395,
      550,
      45,
      22
     ],
     "presentation": 1,
     "presentation_rect": [
      322,
      94,
      42,
      16
     ],
     "text": "clear 6",
     "numinlets": 2,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "name6",
     "maxclass": "comment",
     "patching_rect": [
      1350,
      580,
      150,
      20
     ],
     "presentation": 1,
     "presentation_rect": [
      366,
      94,
      120,
      16
     ],
     "text": "-",
     "numinlets": 1,
     "numoutlets": 0,
     "varname": "name6"
    }
   },
   {
    "box": {
     "id": "min6",
     "maxclass": "live.numbox",
     "patching_rect": [
      1350,
      610,
      40,
      15
     ],
     "presentation": 1,
     "presentation_rect": [
      488,
      95,
      32,
      14
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "Min6",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "Min6",
       "parameter_shortname": "Min6",
       "parameter_type": 1,
       "parameter_mmin": -100,
       "parameter_mmax": 100,
       "parameter_initial": [
        -100
       ],
       "parameter_initial_enable": 1,
       "parameter_unitstyle": 0
      }
     }
    }
   },
   {
    "box": {
     "id": "max6",
     "maxclass": "live.numbox",
     "patching_rect": [
      1395,
      610,
      40,
      15
     ],
     "presentation": 1,
     "presentation_rect": [
      522,
      95,
      32,
      14
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "Max6",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "Max6",
       "parameter_shortname": "Max6",
       "parameter_type": 1,
       "parameter_mmin": -100,
       "parameter_mmax": 100,
       "parameter_initial": [
        100
       ],
       "parameter_initial_enable": 1,
       "parameter_unitstyle": 0
      }
     }
    }
   },
   {
    "box": {
     "id": "su6",
     "maxclass": "newobj",
     "patching_rect": [
      1350,
      650,
      90,
      22
     ],
     "text": "unpack 0 0 0 0",
     "numinlets": 1,
     "numoutlets": 4,
     "outlettype": [
      "int",
      "int",
      "int",
      "int"
     ]
    }
   },
   {
    "box": {
     "id": "st6",
     "maxclass": "newobj",
     "patching_rect": [
      1450,
      680,
      45,
      22
     ],
     "text": "+ 175",
     "numinlets": 2,
     "numoutlets": 1,
     "outlettype": [
      "int"
     ]
    }
   },
   {
    "box": {
     "id": "ccp6",
     "maxclass": "newobj",
     "patching_rect": [
      1350,
      710,
      70,
      22
     ],
     "text": "pack 0 0 0",
     "numinlets": 3,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "ccr6",
     "maxclass": "newobj",
     "patching_rect": [
      1350,
      740,
      60,
      22
     ],
     "text": "zl rot 2",
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
     "id": "cci6",
     "maxclass": "newobj",
     "patching_rect": [
      1350,
      770,
      35,
      22
     ],
     "text": "iter",
     "numinlets": 1,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "mn6",
     "maxclass": "newobj",
     "patching_rect": [
      1440,
      620,
      45,
      22
     ],
     "text": "/ 100.",
     "numinlets": 2,
     "numoutlets": 1,
     "outlettype": [
      "float"
     ]
    }
   },
   {
    "box": {
     "id": "mx6",
     "maxclass": "newobj",
     "patching_rect": [
      1490,
      620,
      45,
      22
     ],
     "text": "/ 100.",
     "numinlets": 2,
     "numoutlets": 1,
     "outlettype": [
      "float"
     ]
    }
   },
   {
    "box": {
     "id": "norm6",
     "maxclass": "newobj",
     "patching_rect": [
      1350,
      810,
      300,
      22
     ],
     "text": "expr ($f1 <= 64) * ($f2 + ($f3 - $f2) * 0.5 * $f1 / 64.) + ($f1 > 64) * (($f2 + $f3) * 0.5 + ($f3 - $f2) * 0.5 * ($f1 - 64) / 63.)",
     "numinlets": 3,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "im6",
     "maxclass": "newobj",
     "patching_rect": [
      1350,
      880,
      90,
      22
     ],
     "text": "expr $i1 == $i3",
     "numinlets": 3,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "iv6",
     "maxclass": "newobj",
     "patching_rect": [
      1350,
      910,
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
     "id": "ig6",
     "maxclass": "newobj",
     "patching_rect": [
      1350,
      940,
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
     "id": "mod6",
     "maxclass": "newobj",
     "patching_rect": [
      1350,
      840,
      160,
      22
     ],
     "text": "live.modulate~ @smoothing 0",
     "numinlets": 2,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "lbl7",
     "maxclass": "comment",
     "patching_rect": [
      1520,
      500,
      20,
      20
     ],
     "presentation": 1,
     "presentation_rect": [
      236,
      112,
      14,
      16
     ],
     "text": "7",
     "numinlets": 1,
     "numoutlets": 0
    }
   },
   {
    "box": {
     "id": "cc7",
     "maxclass": "live.numbox",
     "patching_rect": [
      1520,
      520,
      40,
      15
     ],
     "presentation": 1,
     "presentation_rect": [
      250,
      113,
      30,
      14
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "CC7",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "CC7",
       "parameter_shortname": "CC7",
       "parameter_type": 1,
       "parameter_mmin": 0,
       "parameter_mmax": 127,
       "parameter_initial": [
        26
       ],
       "parameter_initial_enable": 1,
       "parameter_unitstyle": 0
      }
     }
    }
   },
   {
    "box": {
     "id": "map7",
     "maxclass": "message",
     "patching_rect": [
      1520,
      550,
      40,
      22
     ],
     "presentation": 1,
     "presentation_rect": [
      282,
      112,
      38,
      16
     ],
     "text": "map 7",
     "numinlets": 2,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "clr7",
     "maxclass": "message",
     "patching_rect": [
      1565,
      550,
      45,
      22
     ],
     "presentation": 1,
     "presentation_rect": [
      322,
      112,
      42,
      16
     ],
     "text": "clear 7",
     "numinlets": 2,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "name7",
     "maxclass": "comment",
     "patching_rect": [
      1520,
      580,
      150,
      20
     ],
     "presentation": 1,
     "presentation_rect": [
      366,
      112,
      120,
      16
     ],
     "text": "-",
     "numinlets": 1,
     "numoutlets": 0,
     "varname": "name7"
    }
   },
   {
    "box": {
     "id": "min7",
     "maxclass": "live.numbox",
     "patching_rect": [
      1520,
      610,
      40,
      15
     ],
     "presentation": 1,
     "presentation_rect": [
      488,
      113,
      32,
      14
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "Min7",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "Min7",
       "parameter_shortname": "Min7",
       "parameter_type": 1,
       "parameter_mmin": -100,
       "parameter_mmax": 100,
       "parameter_initial": [
        -100
       ],
       "parameter_initial_enable": 1,
       "parameter_unitstyle": 0
      }
     }
    }
   },
   {
    "box": {
     "id": "max7",
     "maxclass": "live.numbox",
     "patching_rect": [
      1565,
      610,
      40,
      15
     ],
     "presentation": 1,
     "presentation_rect": [
      522,
      113,
      32,
      14
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "Max7",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "Max7",
       "parameter_shortname": "Max7",
       "parameter_type": 1,
       "parameter_mmin": -100,
       "parameter_mmax": 100,
       "parameter_initial": [
        100
       ],
       "parameter_initial_enable": 1,
       "parameter_unitstyle": 0
      }
     }
    }
   },
   {
    "box": {
     "id": "su7",
     "maxclass": "newobj",
     "patching_rect": [
      1520,
      650,
      90,
      22
     ],
     "text": "unpack 0 0 0 0",
     "numinlets": 1,
     "numoutlets": 4,
     "outlettype": [
      "int",
      "int",
      "int",
      "int"
     ]
    }
   },
   {
    "box": {
     "id": "st7",
     "maxclass": "newobj",
     "patching_rect": [
      1620,
      680,
      45,
      22
     ],
     "text": "+ 175",
     "numinlets": 2,
     "numoutlets": 1,
     "outlettype": [
      "int"
     ]
    }
   },
   {
    "box": {
     "id": "ccp7",
     "maxclass": "newobj",
     "patching_rect": [
      1520,
      710,
      70,
      22
     ],
     "text": "pack 0 0 0",
     "numinlets": 3,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "ccr7",
     "maxclass": "newobj",
     "patching_rect": [
      1520,
      740,
      60,
      22
     ],
     "text": "zl rot 2",
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
     "id": "cci7",
     "maxclass": "newobj",
     "patching_rect": [
      1520,
      770,
      35,
      22
     ],
     "text": "iter",
     "numinlets": 1,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "mn7",
     "maxclass": "newobj",
     "patching_rect": [
      1610,
      620,
      45,
      22
     ],
     "text": "/ 100.",
     "numinlets": 2,
     "numoutlets": 1,
     "outlettype": [
      "float"
     ]
    }
   },
   {
    "box": {
     "id": "mx7",
     "maxclass": "newobj",
     "patching_rect": [
      1660,
      620,
      45,
      22
     ],
     "text": "/ 100.",
     "numinlets": 2,
     "numoutlets": 1,
     "outlettype": [
      "float"
     ]
    }
   },
   {
    "box": {
     "id": "norm7",
     "maxclass": "newobj",
     "patching_rect": [
      1520,
      810,
      300,
      22
     ],
     "text": "expr ($f1 <= 64) * ($f2 + ($f3 - $f2) * 0.5 * $f1 / 64.) + ($f1 > 64) * (($f2 + $f3) * 0.5 + ($f3 - $f2) * 0.5 * ($f1 - 64) / 63.)",
     "numinlets": 3,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "im7",
     "maxclass": "newobj",
     "patching_rect": [
      1520,
      880,
      90,
      22
     ],
     "text": "expr $i1 == $i3",
     "numinlets": 3,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "iv7",
     "maxclass": "newobj",
     "patching_rect": [
      1520,
      910,
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
     "id": "ig7",
     "maxclass": "newobj",
     "patching_rect": [
      1520,
      940,
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
     "id": "mod7",
     "maxclass": "newobj",
     "patching_rect": [
      1520,
      840,
      160,
      22
     ],
     "text": "live.modulate~ @smoothing 0",
     "numinlets": 2,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "lbl8",
     "maxclass": "comment",
     "patching_rect": [
      1690,
      500,
      20,
      20
     ],
     "presentation": 1,
     "presentation_rect": [
      236,
      130,
      14,
      16
     ],
     "text": "8",
     "numinlets": 1,
     "numoutlets": 0
    }
   },
   {
    "box": {
     "id": "cc8",
     "maxclass": "live.numbox",
     "patching_rect": [
      1690,
      520,
      40,
      15
     ],
     "presentation": 1,
     "presentation_rect": [
      250,
      131,
      30,
      14
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "CC8",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "CC8",
       "parameter_shortname": "CC8",
       "parameter_type": 1,
       "parameter_mmin": 0,
       "parameter_mmax": 127,
       "parameter_initial": [
        27
       ],
       "parameter_initial_enable": 1,
       "parameter_unitstyle": 0
      }
     }
    }
   },
   {
    "box": {
     "id": "map8",
     "maxclass": "message",
     "patching_rect": [
      1690,
      550,
      40,
      22
     ],
     "presentation": 1,
     "presentation_rect": [
      282,
      130,
      38,
      16
     ],
     "text": "map 8",
     "numinlets": 2,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "clr8",
     "maxclass": "message",
     "patching_rect": [
      1735,
      550,
      45,
      22
     ],
     "presentation": 1,
     "presentation_rect": [
      322,
      130,
      42,
      16
     ],
     "text": "clear 8",
     "numinlets": 2,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "name8",
     "maxclass": "comment",
     "patching_rect": [
      1690,
      580,
      150,
      20
     ],
     "presentation": 1,
     "presentation_rect": [
      366,
      130,
      120,
      16
     ],
     "text": "-",
     "numinlets": 1,
     "numoutlets": 0,
     "varname": "name8"
    }
   },
   {
    "box": {
     "id": "min8",
     "maxclass": "live.numbox",
     "patching_rect": [
      1690,
      610,
      40,
      15
     ],
     "presentation": 1,
     "presentation_rect": [
      488,
      131,
      32,
      14
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "Min8",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "Min8",
       "parameter_shortname": "Min8",
       "parameter_type": 1,
       "parameter_mmin": -100,
       "parameter_mmax": 100,
       "parameter_initial": [
        -100
       ],
       "parameter_initial_enable": 1,
       "parameter_unitstyle": 0
      }
     }
    }
   },
   {
    "box": {
     "id": "max8",
     "maxclass": "live.numbox",
     "patching_rect": [
      1735,
      610,
      40,
      15
     ],
     "presentation": 1,
     "presentation_rect": [
      522,
      131,
      32,
      14
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "Max8",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "Max8",
       "parameter_shortname": "Max8",
       "parameter_type": 1,
       "parameter_mmin": -100,
       "parameter_mmax": 100,
       "parameter_initial": [
        100
       ],
       "parameter_initial_enable": 1,
       "parameter_unitstyle": 0
      }
     }
    }
   },
   {
    "box": {
     "id": "su8",
     "maxclass": "newobj",
     "patching_rect": [
      1690,
      650,
      90,
      22
     ],
     "text": "unpack 0 0 0 0",
     "numinlets": 1,
     "numoutlets": 4,
     "outlettype": [
      "int",
      "int",
      "int",
      "int"
     ]
    }
   },
   {
    "box": {
     "id": "st8",
     "maxclass": "newobj",
     "patching_rect": [
      1790,
      680,
      45,
      22
     ],
     "text": "+ 175",
     "numinlets": 2,
     "numoutlets": 1,
     "outlettype": [
      "int"
     ]
    }
   },
   {
    "box": {
     "id": "ccp8",
     "maxclass": "newobj",
     "patching_rect": [
      1690,
      710,
      70,
      22
     ],
     "text": "pack 0 0 0",
     "numinlets": 3,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "ccr8",
     "maxclass": "newobj",
     "patching_rect": [
      1690,
      740,
      60,
      22
     ],
     "text": "zl rot 2",
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
     "id": "cci8",
     "maxclass": "newobj",
     "patching_rect": [
      1690,
      770,
      35,
      22
     ],
     "text": "iter",
     "numinlets": 1,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "mn8",
     "maxclass": "newobj",
     "patching_rect": [
      1780,
      620,
      45,
      22
     ],
     "text": "/ 100.",
     "numinlets": 2,
     "numoutlets": 1,
     "outlettype": [
      "float"
     ]
    }
   },
   {
    "box": {
     "id": "mx8",
     "maxclass": "newobj",
     "patching_rect": [
      1830,
      620,
      45,
      22
     ],
     "text": "/ 100.",
     "numinlets": 2,
     "numoutlets": 1,
     "outlettype": [
      "float"
     ]
    }
   },
   {
    "box": {
     "id": "norm8",
     "maxclass": "newobj",
     "patching_rect": [
      1690,
      810,
      300,
      22
     ],
     "text": "expr ($f1 <= 64) * ($f2 + ($f3 - $f2) * 0.5 * $f1 / 64.) + ($f1 > 64) * (($f2 + $f3) * 0.5 + ($f3 - $f2) * 0.5 * ($f1 - 64) / 63.)",
     "numinlets": 3,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "im8",
     "maxclass": "newobj",
     "patching_rect": [
      1690,
      880,
      90,
      22
     ],
     "text": "expr $i1 == $i3",
     "numinlets": 3,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "iv8",
     "maxclass": "newobj",
     "patching_rect": [
      1690,
      910,
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
     "id": "ig8",
     "maxclass": "newobj",
     "patching_rect": [
      1690,
      940,
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
     "id": "mod8",
     "maxclass": "newobj",
     "patching_rect": [
      1690,
      840,
      160,
      22
     ],
     "text": "live.modulate~ @smoothing 0",
     "numinlets": 2,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "st_pre",
     "maxclass": "newobj",
     "patching_rect": [
      800,
      180,
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
     "id": "st_msg",
     "maxclass": "comment",
     "patching_rect": [
      800,
      210,
      200,
      20
     ],
     "presentation": 1,
     "presentation_rect": [
      122,
      24,
      112,
      120
     ],
     "text": "",
     "numinlets": 1,
     "numoutlets": 0,
     "varname": "st_msg"
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
      "recv_m",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "recv_m",
      1
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
   },
   {
    "patchline": {
     "source": [
      "recv_m",
      0
     ],
     "destination": [
      "m_t",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "m_t",
      1
     ],
     "destination": [
      "m_match",
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
      "m_match",
      5
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
      "m_match",
      6
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "m_match",
      0
     ],
     "destination": [
      "m_gate",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "m_t",
      0
     ],
     "destination": [
      "m_gate",
      1
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "m_gate",
      0
     ],
     "destination": [
      "m_route",
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
      4
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
      "cmd_recv",
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
      "group",
      0
     ],
     "destination": [
      "g_pre",
      0
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
      "l_pre",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "g_pre",
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
      "l_pre",
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
      1
     ],
     "destination": [
      "js_ids",
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
      "m_zero",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "js",
      3
     ],
     "destination": [
      "js_info",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "midiin",
      0
     ],
     "destination": [
      "in_parse",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "in_parse",
      2
     ],
     "destination": [
      "in_t",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "map1",
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
      "clr1",
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
      "t_init",
      0
     ],
     "destination": [
      "min1",
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
      "max1",
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
      "cc1",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "m_route",
      0
     ],
     "destination": [
      "su1",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "su1",
      3
     ],
     "destination": [
      "st1",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "st1",
      0
     ],
     "destination": [
      "ccp1",
      1
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "cc1",
      0
     ],
     "destination": [
      "ccp1",
      2
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "su1",
      0
     ],
     "destination": [
      "ccp1",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "ccp1",
      0
     ],
     "destination": [
      "ccr1",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "ccr1",
      0
     ],
     "destination": [
      "cci1",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "cci1",
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
      "min1",
      0
     ],
     "destination": [
      "mn1",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "max1",
      0
     ],
     "destination": [
      "mx1",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "su1",
      0
     ],
     "destination": [
      "norm1",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "mn1",
      0
     ],
     "destination": [
      "norm1",
      1
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "mx1",
      0
     ],
     "destination": [
      "norm1",
      2
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "in_t",
      1
     ],
     "destination": [
      "im1",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "cc1",
      0
     ],
     "destination": [
      "im1",
      2
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "im1",
      0
     ],
     "destination": [
      "ig1",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "in_t",
      0
     ],
     "destination": [
      "iv1",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "iv1",
      1
     ],
     "destination": [
      "ig1",
      1
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "ig1",
      0
     ],
     "destination": [
      "norm1",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "norm1",
      0
     ],
     "destination": [
      "mod1",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "m_zero",
      0
     ],
     "destination": [
      "mod1",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "js_ids",
      0
     ],
     "destination": [
      "mod1",
      1
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "map2",
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
      "clr2",
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
      "t_init",
      0
     ],
     "destination": [
      "min2",
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
      "max2",
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
      "cc2",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "m_route",
      1
     ],
     "destination": [
      "su2",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "su2",
      3
     ],
     "destination": [
      "st2",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "st2",
      0
     ],
     "destination": [
      "ccp2",
      1
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "cc2",
      0
     ],
     "destination": [
      "ccp2",
      2
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "su2",
      0
     ],
     "destination": [
      "ccp2",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "ccp2",
      0
     ],
     "destination": [
      "ccr2",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "ccr2",
      0
     ],
     "destination": [
      "cci2",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "cci2",
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
      "min2",
      0
     ],
     "destination": [
      "mn2",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "max2",
      0
     ],
     "destination": [
      "mx2",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "su2",
      0
     ],
     "destination": [
      "norm2",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "mn2",
      0
     ],
     "destination": [
      "norm2",
      1
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "mx2",
      0
     ],
     "destination": [
      "norm2",
      2
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "in_t",
      1
     ],
     "destination": [
      "im2",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "cc2",
      0
     ],
     "destination": [
      "im2",
      2
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "im2",
      0
     ],
     "destination": [
      "ig2",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "in_t",
      0
     ],
     "destination": [
      "iv2",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "iv2",
      1
     ],
     "destination": [
      "ig2",
      1
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "ig2",
      0
     ],
     "destination": [
      "norm2",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "norm2",
      0
     ],
     "destination": [
      "mod2",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "m_zero",
      0
     ],
     "destination": [
      "mod2",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "js_ids",
      1
     ],
     "destination": [
      "mod2",
      1
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "map3",
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
      "clr3",
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
      "t_init",
      0
     ],
     "destination": [
      "min3",
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
      "max3",
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
      "cc3",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "m_route",
      2
     ],
     "destination": [
      "su3",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "su3",
      3
     ],
     "destination": [
      "st3",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "st3",
      0
     ],
     "destination": [
      "ccp3",
      1
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "cc3",
      0
     ],
     "destination": [
      "ccp3",
      2
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "su3",
      0
     ],
     "destination": [
      "ccp3",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "ccp3",
      0
     ],
     "destination": [
      "ccr3",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "ccr3",
      0
     ],
     "destination": [
      "cci3",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "cci3",
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
      "min3",
      0
     ],
     "destination": [
      "mn3",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "max3",
      0
     ],
     "destination": [
      "mx3",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "su3",
      0
     ],
     "destination": [
      "norm3",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "mn3",
      0
     ],
     "destination": [
      "norm3",
      1
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "mx3",
      0
     ],
     "destination": [
      "norm3",
      2
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "in_t",
      1
     ],
     "destination": [
      "im3",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "cc3",
      0
     ],
     "destination": [
      "im3",
      2
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "im3",
      0
     ],
     "destination": [
      "ig3",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "in_t",
      0
     ],
     "destination": [
      "iv3",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "iv3",
      1
     ],
     "destination": [
      "ig3",
      1
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "ig3",
      0
     ],
     "destination": [
      "norm3",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "norm3",
      0
     ],
     "destination": [
      "mod3",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "m_zero",
      0
     ],
     "destination": [
      "mod3",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "js_ids",
      2
     ],
     "destination": [
      "mod3",
      1
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "map4",
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
      "clr4",
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
      "t_init",
      0
     ],
     "destination": [
      "min4",
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
      "max4",
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
      "cc4",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "m_route",
      3
     ],
     "destination": [
      "su4",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "su4",
      3
     ],
     "destination": [
      "st4",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "st4",
      0
     ],
     "destination": [
      "ccp4",
      1
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "cc4",
      0
     ],
     "destination": [
      "ccp4",
      2
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "su4",
      0
     ],
     "destination": [
      "ccp4",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "ccp4",
      0
     ],
     "destination": [
      "ccr4",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "ccr4",
      0
     ],
     "destination": [
      "cci4",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "cci4",
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
      "min4",
      0
     ],
     "destination": [
      "mn4",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "max4",
      0
     ],
     "destination": [
      "mx4",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "su4",
      0
     ],
     "destination": [
      "norm4",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "mn4",
      0
     ],
     "destination": [
      "norm4",
      1
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "mx4",
      0
     ],
     "destination": [
      "norm4",
      2
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "in_t",
      1
     ],
     "destination": [
      "im4",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "cc4",
      0
     ],
     "destination": [
      "im4",
      2
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "im4",
      0
     ],
     "destination": [
      "ig4",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "in_t",
      0
     ],
     "destination": [
      "iv4",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "iv4",
      1
     ],
     "destination": [
      "ig4",
      1
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "ig4",
      0
     ],
     "destination": [
      "norm4",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "norm4",
      0
     ],
     "destination": [
      "mod4",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "m_zero",
      0
     ],
     "destination": [
      "mod4",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "js_ids",
      3
     ],
     "destination": [
      "mod4",
      1
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "map5",
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
      "clr5",
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
      "t_init",
      0
     ],
     "destination": [
      "min5",
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
      "max5",
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
      "cc5",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "m_route",
      4
     ],
     "destination": [
      "su5",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "su5",
      3
     ],
     "destination": [
      "st5",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "st5",
      0
     ],
     "destination": [
      "ccp5",
      1
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "cc5",
      0
     ],
     "destination": [
      "ccp5",
      2
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "su5",
      0
     ],
     "destination": [
      "ccp5",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "ccp5",
      0
     ],
     "destination": [
      "ccr5",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "ccr5",
      0
     ],
     "destination": [
      "cci5",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "cci5",
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
      "min5",
      0
     ],
     "destination": [
      "mn5",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "max5",
      0
     ],
     "destination": [
      "mx5",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "su5",
      0
     ],
     "destination": [
      "norm5",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "mn5",
      0
     ],
     "destination": [
      "norm5",
      1
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "mx5",
      0
     ],
     "destination": [
      "norm5",
      2
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "in_t",
      1
     ],
     "destination": [
      "im5",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "cc5",
      0
     ],
     "destination": [
      "im5",
      2
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "im5",
      0
     ],
     "destination": [
      "ig5",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "in_t",
      0
     ],
     "destination": [
      "iv5",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "iv5",
      1
     ],
     "destination": [
      "ig5",
      1
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "ig5",
      0
     ],
     "destination": [
      "norm5",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "norm5",
      0
     ],
     "destination": [
      "mod5",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "m_zero",
      0
     ],
     "destination": [
      "mod5",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "js_ids",
      4
     ],
     "destination": [
      "mod5",
      1
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "map6",
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
      "clr6",
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
      "t_init",
      0
     ],
     "destination": [
      "min6",
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
      "max6",
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
      "cc6",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "m_route",
      5
     ],
     "destination": [
      "su6",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "su6",
      3
     ],
     "destination": [
      "st6",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "st6",
      0
     ],
     "destination": [
      "ccp6",
      1
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "cc6",
      0
     ],
     "destination": [
      "ccp6",
      2
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "su6",
      0
     ],
     "destination": [
      "ccp6",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "ccp6",
      0
     ],
     "destination": [
      "ccr6",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "ccr6",
      0
     ],
     "destination": [
      "cci6",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "cci6",
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
      "min6",
      0
     ],
     "destination": [
      "mn6",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "max6",
      0
     ],
     "destination": [
      "mx6",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "su6",
      0
     ],
     "destination": [
      "norm6",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "mn6",
      0
     ],
     "destination": [
      "norm6",
      1
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "mx6",
      0
     ],
     "destination": [
      "norm6",
      2
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "in_t",
      1
     ],
     "destination": [
      "im6",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "cc6",
      0
     ],
     "destination": [
      "im6",
      2
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "im6",
      0
     ],
     "destination": [
      "ig6",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "in_t",
      0
     ],
     "destination": [
      "iv6",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "iv6",
      1
     ],
     "destination": [
      "ig6",
      1
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "ig6",
      0
     ],
     "destination": [
      "norm6",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "norm6",
      0
     ],
     "destination": [
      "mod6",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "m_zero",
      0
     ],
     "destination": [
      "mod6",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "js_ids",
      5
     ],
     "destination": [
      "mod6",
      1
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "map7",
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
      "clr7",
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
      "t_init",
      0
     ],
     "destination": [
      "min7",
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
      "max7",
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
      "cc7",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "m_route",
      6
     ],
     "destination": [
      "su7",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "su7",
      3
     ],
     "destination": [
      "st7",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "st7",
      0
     ],
     "destination": [
      "ccp7",
      1
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "cc7",
      0
     ],
     "destination": [
      "ccp7",
      2
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "su7",
      0
     ],
     "destination": [
      "ccp7",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "ccp7",
      0
     ],
     "destination": [
      "ccr7",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "ccr7",
      0
     ],
     "destination": [
      "cci7",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "cci7",
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
      "min7",
      0
     ],
     "destination": [
      "mn7",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "max7",
      0
     ],
     "destination": [
      "mx7",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "su7",
      0
     ],
     "destination": [
      "norm7",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "mn7",
      0
     ],
     "destination": [
      "norm7",
      1
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "mx7",
      0
     ],
     "destination": [
      "norm7",
      2
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "in_t",
      1
     ],
     "destination": [
      "im7",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "cc7",
      0
     ],
     "destination": [
      "im7",
      2
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "im7",
      0
     ],
     "destination": [
      "ig7",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "in_t",
      0
     ],
     "destination": [
      "iv7",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "iv7",
      1
     ],
     "destination": [
      "ig7",
      1
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "ig7",
      0
     ],
     "destination": [
      "norm7",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "norm7",
      0
     ],
     "destination": [
      "mod7",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "m_zero",
      0
     ],
     "destination": [
      "mod7",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "js_ids",
      6
     ],
     "destination": [
      "mod7",
      1
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "map8",
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
      "clr8",
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
      "t_init",
      0
     ],
     "destination": [
      "min8",
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
      "max8",
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
      "cc8",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "m_route",
      7
     ],
     "destination": [
      "su8",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "su8",
      3
     ],
     "destination": [
      "st8",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "st8",
      0
     ],
     "destination": [
      "ccp8",
      1
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "cc8",
      0
     ],
     "destination": [
      "ccp8",
      2
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "su8",
      0
     ],
     "destination": [
      "ccp8",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "ccp8",
      0
     ],
     "destination": [
      "ccr8",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "ccr8",
      0
     ],
     "destination": [
      "cci8",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "cci8",
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
      "min8",
      0
     ],
     "destination": [
      "mn8",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "max8",
      0
     ],
     "destination": [
      "mx8",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "su8",
      0
     ],
     "destination": [
      "norm8",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "mn8",
      0
     ],
     "destination": [
      "norm8",
      1
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "mx8",
      0
     ],
     "destination": [
      "norm8",
      2
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "in_t",
      1
     ],
     "destination": [
      "im8",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "cc8",
      0
     ],
     "destination": [
      "im8",
      2
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "im8",
      0
     ],
     "destination": [
      "ig8",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "in_t",
      0
     ],
     "destination": [
      "iv8",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "iv8",
      1
     ],
     "destination": [
      "ig8",
      1
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "ig8",
      0
     ],
     "destination": [
      "norm8",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "norm8",
      0
     ],
     "destination": [
      "mod8",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "m_zero",
      0
     ],
     "destination": [
      "mod8",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "js_ids",
      7
     ],
     "destination": [
      "mod8",
      1
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
      "st_pre",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "st_pre",
      0
     ],
     "destination": [
      "st_msg",
      0
     ]
    }
   }
  ],
  "dependency_cache": [
   {
    "name": "kbLane.js",
    "bootpath": ".",
    "type": "TEXT",
    "implicit": 1
   }
  ],
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
   "pattr": [
    "kbLaneData",
    "kbLaneData",
    0
   ],
   "cc1": [
    "CC1",
    "CC1",
    0
   ],
   "min1": [
    "Min1",
    "Min1",
    0
   ],
   "max1": [
    "Max1",
    "Max1",
    0
   ],
   "cc2": [
    "CC2",
    "CC2",
    0
   ],
   "min2": [
    "Min2",
    "Min2",
    0
   ],
   "max2": [
    "Max2",
    "Max2",
    0
   ],
   "cc3": [
    "CC3",
    "CC3",
    0
   ],
   "min3": [
    "Min3",
    "Min3",
    0
   ],
   "max3": [
    "Max3",
    "Max3",
    0
   ],
   "cc4": [
    "CC4",
    "CC4",
    0
   ],
   "min4": [
    "Min4",
    "Min4",
    0
   ],
   "max4": [
    "Max4",
    "Max4",
    0
   ],
   "cc5": [
    "CC5",
    "CC5",
    0
   ],
   "min5": [
    "Min5",
    "Min5",
    0
   ],
   "max5": [
    "Max5",
    "Max5",
    0
   ],
   "cc6": [
    "CC6",
    "CC6",
    0
   ],
   "min6": [
    "Min6",
    "Min6",
    0
   ],
   "max6": [
    "Max6",
    "Max6",
    0
   ],
   "cc7": [
    "CC7",
    "CC7",
    0
   ],
   "min7": [
    "Min7",
    "Min7",
    0
   ],
   "max7": [
    "Max7",
    "Max7",
    0
   ],
   "cc8": [
    "CC8",
    "CC8",
    0
   ],
   "min8": [
    "Min8",
    "Min8",
    0
   ],
   "max8": [
    "Max8",
    "Max8",
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
     "kbLane.js": {
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