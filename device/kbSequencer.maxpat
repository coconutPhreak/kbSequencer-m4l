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
     "text": "kbSequencer \u00b7 step 4: pad UI   v0.5.4 \u00b7 1115.0049",
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
     "id": "clk_metro",
     "maxclass": "newobj",
     "patching_rect": [
      30,
      520,
      190,
      22
     ],
     "text": "metro 16n @quantize 16n @active 1",
     "numinlets": 2,
     "numoutlets": 1,
     "outlettype": [
      "bang"
     ]
    }
   },
   {
    "box": {
     "id": "clk_tr",
     "maxclass": "newobj",
     "patching_rect": [
      30,
      550,
      70,
      22
     ],
     "text": "transport",
     "numinlets": 2,
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
     "id": "clk_sel",
     "maxclass": "newobj",
     "patching_rect": [
      30,
      580,
      40,
      22
     ],
     "text": "sel 1",
     "numinlets": 2,
     "numoutlets": 2,
     "outlettype": [
      "bang",
      ""
     ]
    }
   },
   {
    "box": {
     "id": "clk_f",
     "maxclass": "newobj",
     "patching_rect": [
      30,
      610,
      30,
      22
     ],
     "text": "f",
     "numinlets": 2,
     "numoutlets": 1,
     "outlettype": [
      "float"
     ]
    }
   },
   {
    "box": {
     "id": "clk_step",
     "maxclass": "newobj",
     "patching_rect": [
      30,
      640,
      160,
      22
     ],
     "text": "expr int(($f1 + 60.) / 120.)",
     "numinlets": 1,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "clk_t",
     "maxclass": "newobj",
     "patching_rect": [
      30,
      670,
      40,
      22
     ],
     "text": "t i i",
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "int",
      "int"
     ]
    }
   },
   {
    "box": {
     "id": "clk_mod",
     "maxclass": "newobj",
     "patching_rect": [
      120,
      700,
      40,
      22
     ],
     "text": "% 64",
     "numinlets": 2,
     "numoutlets": 1,
     "outlettype": [
      "int"
     ]
    }
   },
   {
    "box": {
     "id": "ev_coll",
     "maxclass": "newobj",
     "patching_rect": [
      120,
      730,
      50,
      22
     ],
     "text": "coll",
     "numinlets": 1,
     "numoutlets": 4,
     "outlettype": [
      "",
      "",
      "",
      "bang"
     ]
    }
   },
   {
    "box": {
     "id": "ev_iter",
     "maxclass": "newobj",
     "patching_rect": [
      120,
      760,
      60,
      22
     ],
     "text": "zl iter 5",
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
     "id": "ev_route",
     "maxclass": "newobj",
     "patching_rect": [
      120,
      790,
      60,
      22
     ],
     "text": "route 0 1",
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
     "id": "clk_defer",
     "maxclass": "newobj",
     "patching_rect": [
      30,
      700,
      60,
      22
     ],
     "text": "deferlow",
     "numinlets": 1,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "clk_pre",
     "maxclass": "newobj",
     "patching_rect": [
      30,
      730,
      75,
      22
     ],
     "text": "prepend tick",
     "numinlets": 1,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "dbg_split",
     "maxclass": "newobj",
     "patching_rect": [
      480,
      920,
      80,
      22
     ],
     "text": "split 128 239",
     "numinlets": 3,
     "numoutlets": 2,
     "outlettype": [
      "int",
      "int"
     ]
    }
   },
   {
    "box": {
     "id": "dbg_and",
     "maxclass": "newobj",
     "patching_rect": [
      480,
      950,
      40,
      22
     ],
     "text": "& 15",
     "numinlets": 2,
     "numoutlets": 1,
     "outlettype": [
      "int"
     ]
    }
   },
   {
    "box": {
     "id": "dbg_plus",
     "maxclass": "newobj",
     "patching_rect": [
      480,
      980,
      30,
      22
     ],
     "text": "+ 1",
     "numinlets": 2,
     "numoutlets": 1,
     "outlettype": [
      "int"
     ]
    }
   },
   {
    "box": {
     "id": "dbg_out",
     "maxclass": "number",
     "patching_rect": [
      480,
      1010,
      40,
      22
     ],
     "presentation": 1,
     "presentation_rect": [
      376,
      104,
      36,
      20
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
     "id": "c_dbg",
     "maxclass": "comment",
     "patching_rect": [
      530,
      1010,
      50,
      20
     ],
     "presentation": 1,
     "presentation_rect": [
      344,
      104,
      34,
      20
     ],
     "text": "Out ch",
     "numinlets": 1,
     "numoutlets": 0
    }
   },
   {
    "box": {
     "id": "group",
     "maxclass": "live.numbox",
     "patching_rect": [
      600,
      820,
      44,
      15
     ],
     "presentation": 1,
     "presentation_rect": [
      58,
      76,
      40,
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
     "id": "c_group",
     "maxclass": "comment",
     "patching_rect": [
      650,
      820,
      40,
      20
     ],
     "presentation": 1,
     "presentation_rect": [
      10,
      74,
      46,
      18
     ],
     "text": "Group",
     "numinlets": 1,
     "numoutlets": 0
    }
   },
   {
    "box": {
     "id": "lane_send",
     "maxclass": "newobj",
     "patching_rect": [
      600,
      960,
      80,
      22
     ],
     "text": "send kbLanes",
     "numinlets": 1,
     "numoutlets": 0,
     "outlettype": []
    }
   },
   {
    "box": {
     "id": "lane_pack0",
     "maxclass": "newobj",
     "patching_rect": [
      600,
      920,
      90,
      22
     ],
     "text": "pack 0 1 0",
     "numinlets": 3,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "lane_pack1",
     "maxclass": "newobj",
     "patching_rect": [
      720,
      920,
      90,
      22
     ],
     "text": "pack 0 1 1",
     "numinlets": 3,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "ev_unpack0",
     "maxclass": "newobj",
     "patching_rect": [
      120,
      830,
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
     "id": "ev_mk0",
     "maxclass": "newobj",
     "patching_rect": [
      120,
      860,
      100,
      22
     ],
     "text": "makenote 100 100",
     "numinlets": 3,
     "numoutlets": 2,
     "outlettype": [
      "float",
      "float"
     ]
    }
   },
   {
    "box": {
     "id": "ev_pack0",
     "maxclass": "newobj",
     "patching_rect": [
      120,
      890,
      55,
      22
     ],
     "text": "pack 0 0",
     "numinlets": 2,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "ev_mf0",
     "maxclass": "newobj",
     "patching_rect": [
      120,
      920,
      110,
      22
     ],
     "text": "midiformat",
     "numinlets": 7,
     "numoutlets": 2,
     "outlettype": [
      "int",
      ""
     ]
    }
   },
   {
    "box": {
     "id": "ev_unpack1",
     "maxclass": "newobj",
     "patching_rect": [
      300,
      830,
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
     "id": "ev_mk1",
     "maxclass": "newobj",
     "patching_rect": [
      300,
      860,
      100,
      22
     ],
     "text": "makenote 100 100",
     "numinlets": 3,
     "numoutlets": 2,
     "outlettype": [
      "float",
      "float"
     ]
    }
   },
   {
    "box": {
     "id": "ev_pack1",
     "maxclass": "newobj",
     "patching_rect": [
      300,
      890,
      55,
      22
     ],
     "text": "pack 0 0",
     "numinlets": 2,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "ev_mf1",
     "maxclass": "newobj",
     "patching_rect": [
      300,
      920,
      110,
      22
     ],
     "text": "midiformat",
     "numinlets": 7,
     "numoutlets": 2,
     "outlettype": [
      "int",
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
   },
   {
    "box": {
     "id": "msg_undo",
     "maxclass": "message",
     "patching_rect": [
      870,
      140,
      60,
      22
     ],
     "presentation": 1,
     "presentation_rect": [
      382,
      24,
      58,
      22
     ],
     "text": "undo",
     "numinlets": 2,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "msg_redo",
     "maxclass": "message",
     "patching_rect": [
      870,
      170,
      60,
      22
     ],
     "presentation": 1,
     "presentation_rect": [
      382,
      48,
      58,
      22
     ],
     "text": "redo",
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
      "clk_metro",
      0
     ],
     "destination": [
      "clk_tr",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "clk_tr",
      7
     ],
     "destination": [
      "clk_f",
      1
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "clk_tr",
      6
     ],
     "destination": [
      "clk_sel",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "clk_sel",
      0
     ],
     "destination": [
      "clk_f",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "clk_f",
      0
     ],
     "destination": [
      "clk_step",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "clk_step",
      0
     ],
     "destination": [
      "clk_t",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "clk_t",
      1
     ],
     "destination": [
      "clk_mod",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "clk_mod",
      0
     ],
     "destination": [
      "ev_coll",
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
      "ev_coll",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "ev_coll",
      0
     ],
     "destination": [
      "ev_iter",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "ev_iter",
      0
     ],
     "destination": [
      "ev_route",
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
      "ev_iter",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "clk_t",
      0
     ],
     "destination": [
      "clk_defer",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "clk_defer",
      0
     ],
     "destination": [
      "clk_pre",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "clk_pre",
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
      "dbg_split",
      0
     ],
     "destination": [
      "dbg_and",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "dbg_and",
      0
     ],
     "destination": [
      "dbg_plus",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "dbg_plus",
      0
     ],
     "destination": [
      "dbg_out",
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
      "group",
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
      "lane_pack0",
      1
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "lane_pack0",
      0
     ],
     "destination": [
      "lane_send",
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
      "lane_pack1",
      1
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "lane_pack1",
      0
     ],
     "destination": [
      "lane_send",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "ev_route",
      0
     ],
     "destination": [
      "ev_unpack0",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "ev_unpack0",
      0
     ],
     "destination": [
      "ev_mk0",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "ev_unpack0",
      1
     ],
     "destination": [
      "ev_mk0",
      1
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "ev_unpack0",
      2
     ],
     "destination": [
      "ev_mk0",
      2
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "ev_unpack0",
      3
     ],
     "destination": [
      "ev_mf0",
      6
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "ev_mk0",
      0
     ],
     "destination": [
      "ev_pack0",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "ev_mk0",
      1
     ],
     "destination": [
      "ev_pack0",
      1
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "ev_pack0",
      0
     ],
     "destination": [
      "ev_mf0",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "ev_mf0",
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
      "ev_mf0",
      0
     ],
     "destination": [
      "lane_pack0",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "ev_mf0",
      0
     ],
     "destination": [
      "dbg_split",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "ev_route",
      1
     ],
     "destination": [
      "ev_unpack1",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "ev_unpack1",
      0
     ],
     "destination": [
      "ev_mk1",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "ev_unpack1",
      1
     ],
     "destination": [
      "ev_mk1",
      1
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "ev_unpack1",
      2
     ],
     "destination": [
      "ev_mk1",
      2
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "ev_unpack1",
      3
     ],
     "destination": [
      "ev_mf1",
      6
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "ev_mk1",
      0
     ],
     "destination": [
      "ev_pack1",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "ev_mk1",
      1
     ],
     "destination": [
      "ev_pack1",
      1
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "ev_pack1",
      0
     ],
     "destination": [
      "ev_mf1",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "ev_mf1",
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
      "ev_mf1",
      0
     ],
     "destination": [
      "lane_pack1",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "ev_mf1",
      0
     ],
     "destination": [
      "dbg_split",
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
   },
   {
    "patchline": {
     "source": [
      "msg_undo",
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
      "msg_redo",
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
   "group": [
    "Group",
    "Group",
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