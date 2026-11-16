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
   240,
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
     "text": "v0.16.0 \u00b7 1116.2258",
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
     "text": "expr ($i3 == $i5) && ($i4 == $i6)",
     "numinlets": 6,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "m_slice",
     "maxclass": "newobj",
     "patching_rect": [
      500,
      220,
      65,
      22
     ],
     "text": "zl slice 2",
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
     "text": "route 0 1 2 3 4 5 6 7 8",
     "numinlets": 1,
     "numoutlets": 10,
     "outlettype": [
      "",
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
     "id": "m_reset",
     "maxclass": "newobj",
     "patching_rect": [
      500,
      340,
      30,
      22
     ],
     "text": "t b",
     "numinlets": 1,
     "numoutlets": 1,
     "outlettype": [
      "bang"
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
      90,
      22
     ],
     "text": "js kbLane.js",
     "numinlets": 1,
     "numoutlets": 4,
     "outlettype": [
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
      95,
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
      110,
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
     "id": "m_div0",
     "maxclass": "newobj",
     "patching_rect": [
      500,
      420,
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
     "id": "m_mod0",
     "maxclass": "newobj",
     "patching_rect": [
      500,
      460,
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
     "id": "m_div1",
     "maxclass": "newobj",
     "patching_rect": [
      570,
      420,
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
     "id": "m_mod1",
     "maxclass": "newobj",
     "patching_rect": [
      570,
      460,
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
     "id": "m_div2",
     "maxclass": "newobj",
     "patching_rect": [
      640,
      420,
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
     "id": "m_mod2",
     "maxclass": "newobj",
     "patching_rect": [
      640,
      460,
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
     "id": "m_div3",
     "maxclass": "newobj",
     "patching_rect": [
      710,
      420,
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
     "id": "m_mod3",
     "maxclass": "newobj",
     "patching_rect": [
      710,
      460,
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
     "id": "m_div4",
     "maxclass": "newobj",
     "patching_rect": [
      780,
      420,
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
     "id": "m_mod4",
     "maxclass": "newobj",
     "patching_rect": [
      780,
      460,
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
     "id": "m_div5",
     "maxclass": "newobj",
     "patching_rect": [
      850,
      420,
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
     "id": "m_mod5",
     "maxclass": "newobj",
     "patching_rect": [
      850,
      460,
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
     "id": "m_div6",
     "maxclass": "newobj",
     "patching_rect": [
      920,
      420,
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
     "id": "m_mod6",
     "maxclass": "newobj",
     "patching_rect": [
      920,
      460,
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
     "id": "m_div7",
     "maxclass": "newobj",
     "patching_rect": [
      990,
      420,
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
     "id": "m_mod7",
     "maxclass": "newobj",
     "patching_rect": [
      990,
      460,
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
      4
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
      5
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
      "m_slice",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "m_slice",
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
      "m_route",
      0
     ],
     "destination": [
      "m_reset",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "m_reset",
      0
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
      "m_reset",
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
      "m_route",
      1
     ],
     "destination": [
      "m_div0",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "m_div0",
      0
     ],
     "destination": [
      "m_mod0",
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
      "m_mod0",
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
      "m_mod0",
      1
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
      "m_div1",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "m_div1",
      0
     ],
     "destination": [
      "m_mod1",
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
      "m_mod1",
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
      "m_mod1",
      1
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
      "m_div2",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "m_div2",
      0
     ],
     "destination": [
      "m_mod2",
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
      "m_mod2",
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
      "m_mod2",
      1
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
      "m_div3",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "m_div3",
      0
     ],
     "destination": [
      "m_mod3",
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
      "m_mod3",
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
      "m_mod3",
      1
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
      "m_div4",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "m_div4",
      0
     ],
     "destination": [
      "m_mod4",
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
      "m_mod4",
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
      "m_mod4",
      1
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
      "m_div5",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "m_div5",
      0
     ],
     "destination": [
      "m_mod5",
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
      "m_mod5",
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
      "m_mod5",
      1
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
      "m_div6",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "m_div6",
      0
     ],
     "destination": [
      "m_mod6",
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
      "m_mod6",
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
      "m_mod6",
      1
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "m_route",
      8
     ],
     "destination": [
      "m_div7",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "m_div7",
      0
     ],
     "destination": [
      "m_mod7",
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
      "m_mod7",
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
      "m_mod7",
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