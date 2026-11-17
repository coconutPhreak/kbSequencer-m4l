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
   640,
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
     "text": "kbSequencer   v0.19.0 \u00b7 1117.1256",
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
     "id": "clk_once",
     "maxclass": "newobj",
     "patching_rect": [
      30,
      655,
      70,
      22
     ],
     "text": "change -1",
     "numinlets": 1,
     "numoutlets": 3,
     "outlettype": [
      "",
      "int",
      "int"
     ]
    }
   },
   {
    "box": {
     "id": "clk_poll",
     "maxclass": "newobj",
     "patching_rect": [
      250,
      520,
      110,
      22
     ],
     "text": "metro 2 @active 1",
     "numinlets": 2,
     "numoutlets": 1,
     "outlettype": [
      "bang"
     ]
    }
   },
   {
    "box": {
     "id": "clk_tr2",
     "maxclass": "newobj",
     "patching_rect": [
      250,
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
     "id": "clk_run",
     "maxclass": "newobj",
     "patching_rect": [
      250,
      580,
      50,
      22
     ],
     "text": "change",
     "numinlets": 1,
     "numoutlets": 3,
     "outlettype": [
      "",
      "int",
      "int"
     ]
    }
   },
   {
    "box": {
     "id": "clk_edge",
     "maxclass": "newobj",
     "patching_rect": [
      250,
      610,
      50,
      22
     ],
     "text": "sel 1 0",
     "numinlets": 3,
     "numoutlets": 3,
     "outlettype": [
      "bang",
      "bang",
      ""
     ]
    }
   },
   {
    "box": {
     "id": "clk_reset",
     "maxclass": "message",
     "patching_rect": [
      310,
      640,
      50,
      22
     ],
     "text": "set -1",
     "numinlets": 2,
     "numoutlets": 1,
     "outlettype": [
      ""
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
     "text": "zl iter 6 @zlmaxsize 4096",
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
     "id": "ev_t",
     "maxclass": "newobj",
     "patching_rect": [
      120,
      775,
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
     "id": "ev_off",
     "maxclass": "newobj",
     "patching_rect": [
      200,
      775,
      55,
      22
     ],
     "text": "zl nth 1",
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
     "id": "ev_rest",
     "maxclass": "newobj",
     "patching_rect": [
      120,
      790,
      60,
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
     "id": "ev_pipe",
     "maxclass": "newobj",
     "patching_rect": [
      120,
      805,
      120,
      22
     ],
     "text": "pipe 0 0 0 0 0 0",
     "numinlets": 6,
     "numoutlets": 5,
     "outlettype": [
      "int",
      "int",
      "int",
      "int",
      "int"
     ]
    }
   },
   {
    "box": {
     "id": "ev_pack",
     "maxclass": "newobj",
     "patching_rect": [
      120,
      820,
      110,
      22
     ],
     "text": "pack 0 0 0 0 0",
     "numinlets": 5,
     "numoutlets": 1,
     "outlettype": [
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
      90,
      22
     ],
     "text": "route 0 1 2 3 4",
     "numinlets": 1,
     "numoutlets": 6,
     "outlettype": [
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
     "id": "ev_clear",
     "maxclass": "message",
     "patching_rect": [
      260,
      805,
      40,
      22
     ],
     "text": "clear",
     "numinlets": 2,
     "numoutlets": 1,
     "outlettype": [
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
     "id": "pb_unpack",
     "maxclass": "newobj",
     "patching_rect": [
      480,
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
     "id": "pb_pack",
     "maxclass": "newobj",
     "patching_rect": [
      480,
      860,
      55,
      22
     ],
     "text": "pack 0 1",
     "numinlets": 2,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "pb_t",
     "maxclass": "newobj",
     "patching_rect": [
      480,
      890,
      50,
      22
     ],
     "text": "t l l l",
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
     "id": "pb_st",
     "maxclass": "newobj",
     "patching_rect": [
      480,
      920,
      90,
      22
     ],
     "text": "expr 223 + $i2",
     "numinlets": 2,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "pb_lsb",
     "maxclass": "newobj",
     "patching_rect": [
      580,
      920,
      90,
      22
     ],
     "text": "expr $i1 & 127",
     "numinlets": 2,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "pb_msb",
     "maxclass": "newobj",
     "patching_rect": [
      680,
      920,
      120,
      22
     ],
     "text": "expr ($i1 >> 7) & 127",
     "numinlets": 2,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "pb_bytes",
     "maxclass": "newobj",
     "patching_rect": [
      480,
      950,
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
     "id": "pb_iter",
     "maxclass": "newobj",
     "patching_rect": [
      480,
      980,
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
     "id": "mac0_slice",
     "maxclass": "newobj",
     "patching_rect": [
      820,
      830,
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
     "id": "mac0_pack",
     "maxclass": "newobj",
     "patching_rect": [
      820,
      860,
      90,
      22
     ],
     "text": "pack 0 0 1 0",
     "numinlets": 4,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "mac0_pre",
     "maxclass": "newobj",
     "patching_rect": [
      820,
      890,
      70,
      22
     ],
     "text": "prepend m",
     "numinlets": 1,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "mac1_slice",
     "maxclass": "newobj",
     "patching_rect": [
      1020,
      830,
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
     "id": "mac1_pack",
     "maxclass": "newobj",
     "patching_rect": [
      1020,
      860,
      90,
      22
     ],
     "text": "pack 0 0 1 1",
     "numinlets": 4,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "mac1_pre",
     "maxclass": "newobj",
     "patching_rect": [
      1020,
      890,
      70,
      22
     ],
     "text": "prepend m",
     "numinlets": 1,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "info_recv",
     "maxclass": "newobj",
     "patching_rect": [
      1240,
      830,
      110,
      22
     ],
     "text": "receive kbLaneInfo",
     "numinlets": 1,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "info_pre",
     "maxclass": "newobj",
     "patching_rect": [
      1240,
      860,
      100,
      22
     ],
     "text": "prepend laneinfo",
     "numinlets": 1,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "lane_cmd",
     "maxclass": "newobj",
     "patching_rect": [
      1240,
      890,
      95,
      22
     ],
     "text": "send kbLaneCmd",
     "numinlets": 1,
     "numoutlets": 0,
     "outlettype": [],
     "varname": "lane_cmd"
    }
   },
   {
    "box": {
     "id": "group_pre",
     "maxclass": "newobj",
     "patching_rect": [
      1240,
      800,
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
     "id": "mv_kick",
     "maxclass": "comment",
     "patching_rect": [
      1240,
      930,
      200,
      20
     ],
     "presentation": 1,
     "presentation_rect": [
      424,
      24,
      210,
      68
     ],
     "text": "",
     "numinlets": 1,
     "numoutlets": 0,
     "varname": "mv_kick"
    }
   },
   {
    "box": {
     "id": "mv_bass",
     "maxclass": "comment",
     "patching_rect": [
      1240,
      960,
      200,
      20
     ],
     "presentation": 1,
     "presentation_rect": [
      424,
      94,
      210,
      68
     ],
     "text": "",
     "numinlets": 1,
     "numoutlets": 0,
     "varname": "mv_bass"
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
   },
   {
    "box": {
     "id": "pv_kickChannel",
     "maxclass": "live.numbox",
     "patching_rect": [
      1000,
      20,
      80,
      15
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "pv_kickChannel",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "KickCh",
       "parameter_shortname": "Kick Ch",
       "parameter_initial_enable": 0,
       "parameter_type": 1,
       "parameter_mmin": 1,
       "parameter_mmax": 16,
       "parameter_unitstyle": 0
      }
     }
    }
   },
   {
    "box": {
     "id": "pv_bassChannel",
     "maxclass": "live.numbox",
     "patching_rect": [
      1000,
      44,
      80,
      15
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "pv_bassChannel",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "BassCh",
       "parameter_shortname": "Bass Ch",
       "parameter_initial_enable": 0,
       "parameter_type": 1,
       "parameter_mmin": 1,
       "parameter_mmax": 16,
       "parameter_unitstyle": 0
      }
     }
    }
   },
   {
    "box": {
     "id": "pv_kickNote",
     "maxclass": "live.numbox",
     "patching_rect": [
      1000,
      68,
      80,
      15
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "pv_kickNote",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "KickNote",
       "parameter_shortname": "Kick Note",
       "parameter_initial_enable": 0,
       "parameter_type": 1,
       "parameter_mmin": 0,
       "parameter_mmax": 127,
       "parameter_unitstyle": 8
      }
     }
    }
   },
   {
    "box": {
     "id": "pv_bendRange",
     "maxclass": "live.numbox",
     "patching_rect": [
      1000,
      92,
      80,
      15
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "pv_bendRange",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "BendRange",
       "parameter_shortname": "Bend",
       "parameter_initial_enable": 0,
       "parameter_type": 1,
       "parameter_mmin": 1,
       "parameter_mmax": 96,
       "parameter_unitstyle": 9,
       "parameter_units": "%d st"
      }
     }
    }
   },
   {
    "box": {
     "id": "pv_scaleFollow",
     "maxclass": "live.menu",
     "patching_rect": [
      1000,
      116,
      80,
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
     "varname": "pv_scaleFollow",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "ScaleFollow",
       "parameter_shortname": "Scale",
       "parameter_initial_enable": 0,
       "parameter_type": 2,
       "parameter_enum": [
        "Off",
        "On"
       ],
       "parameter_mmax": 1
      }
     }
    }
   },
   {
    "box": {
     "id": "pv_swing",
     "maxclass": "live.numbox",
     "patching_rect": [
      1000,
      140,
      80,
      15
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "pv_swing",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "Swing",
       "parameter_shortname": "Swing",
       "parameter_initial_enable": 0,
       "parameter_type": 1,
       "parameter_mmin": 50,
       "parameter_mmax": 75,
       "parameter_unitstyle": 9,
       "parameter_units": "%d %%"
      }
     }
    }
   },
   {
    "box": {
     "id": "pv_macroRefresh",
     "maxclass": "live.menu",
     "patching_rect": [
      1000,
      164,
      80,
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
     "varname": "pv_macroRefresh",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "MacroRefresh",
       "parameter_shortname": "Refresh",
       "parameter_initial_enable": 0,
       "parameter_type": 2,
       "parameter_enum": [
        "Turn",
        "Sent"
       ],
       "parameter_mmax": 1
      }
     }
    }
   },
   {
    "box": {
     "id": "pv_takeover",
     "maxclass": "live.menu",
     "patching_rect": [
      1000,
      188,
      80,
      15
     ],
     "presentation": 1,
     "presentation_rect": [
      62,
      48,
      100,
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
     "varname": "pv_takeover",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "Takeover",
       "parameter_shortname": "Takeover",
       "parameter_initial_enable": 1,
       "parameter_initial": [
        1
       ],
       "parameter_type": 2,
       "parameter_enum": [
        "Off",
        "Track selected",
        "Always"
       ],
       "parameter_mmax": 2
      }
     }
    }
   },
   {
    "box": {
     "id": "pv_note",
     "maxclass": "live.numbox",
     "patching_rect": [
      1000,
      212,
      80,
      15
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "pv_note",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "Note",
       "parameter_shortname": "Note",
       "parameter_initial_enable": 0,
       "parameter_type": 1,
       "parameter_mmin": 0,
       "parameter_mmax": 127,
       "parameter_unitstyle": 8
      }
     }
    }
   },
   {
    "box": {
     "id": "pv_velocity",
     "maxclass": "live.numbox",
     "patching_rect": [
      1000,
      236,
      80,
      15
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "pv_velocity",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "Velocity",
       "parameter_shortname": "Velocity",
       "parameter_initial_enable": 0,
       "parameter_type": 1,
       "parameter_mmin": 0,
       "parameter_mmax": 127,
       "parameter_unitstyle": 0
      }
     }
    }
   },
   {
    "box": {
     "id": "pv_length",
     "maxclass": "live.menu",
     "patching_rect": [
      1000,
      260,
      80,
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
     "varname": "pv_length",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "Length",
       "parameter_shortname": "Length",
       "parameter_initial_enable": 0,
       "parameter_type": 2,
       "parameter_enum": [
        "0.125",
        "0.188",
        "1/64",
        "0.313",
        "0.375",
        "0.438",
        "1/32",
        "0.563",
        "0.625",
        "0.688",
        "0.75",
        "0.813",
        "0.875",
        "0.938",
        "1/16",
        "1.06",
        "1.13",
        "1.19",
        "1.25",
        "1.31",
        "1.38",
        "1.44",
        "1.5",
        "1.56",
        "1.63",
        "1.69",
        "1.75",
        "1.81",
        "1.88",
        "1.94",
        "1/8",
        "2.13",
        "2.25",
        "2.38",
        "2.5",
        "2.63",
        "2.75",
        "2.88",
        "3",
        "3.13",
        "3.25",
        "3.38",
        "3.5",
        "3.63",
        "3.75",
        "3.88",
        "1/4",
        "4.25",
        "4.5",
        "4.75",
        "5",
        "5.25",
        "5.5",
        "5.75",
        "6",
        "6.25",
        "6.5",
        "6.75",
        "7",
        "7.25",
        "7.5",
        "7.75",
        "1/2",
        "8.5",
        "9",
        "9.5",
        "10",
        "10.5",
        "11",
        "11.5",
        "12",
        "12.5",
        "13",
        "13.5",
        "14",
        "14.5",
        "15",
        "15.5",
        "1/1",
        "17",
        "18",
        "19",
        "20",
        "21",
        "22",
        "23",
        "24",
        "25",
        "26",
        "27",
        "28",
        "29",
        "30",
        "31",
        "32",
        "34",
        "36",
        "38",
        "40",
        "42",
        "44",
        "46",
        "48",
        "50",
        "52",
        "54",
        "56",
        "58",
        "60",
        "62",
        "64",
        "68",
        "72",
        "76",
        "80",
        "84",
        "88",
        "92",
        "96",
        "100",
        "104",
        "108",
        "112",
        "116",
        "120",
        "124",
        "128",
        "INF"
       ],
       "parameter_mmax": 127
      }
     }
    }
   },
   {
    "box": {
     "id": "pv_microtime",
     "maxclass": "live.numbox",
     "patching_rect": [
      1000,
      284,
      80,
      15
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "pv_microtime",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "Micro",
       "parameter_shortname": "Micro",
       "parameter_initial_enable": 0,
       "parameter_type": 1,
       "parameter_mmin": -12,
       "parameter_mmax": 12,
       "parameter_unitstyle": 9,
       "parameter_units": "%d/24"
      }
     }
    }
   },
   {
    "box": {
     "id": "pv_probability",
     "maxclass": "live.numbox",
     "patching_rect": [
      1090,
      20,
      80,
      15
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "pv_probability",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "Prob",
       "parameter_shortname": "Prob",
       "parameter_initial_enable": 0,
       "parameter_type": 1,
       "parameter_mmin": 0,
       "parameter_mmax": 100,
       "parameter_unitstyle": 9,
       "parameter_units": "%d %%"
      }
     }
    }
   },
   {
    "box": {
     "id": "pv_accent",
     "maxclass": "live.menu",
     "patching_rect": [
      1090,
      44,
      80,
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
     "varname": "pv_accent",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "Accent",
       "parameter_shortname": "Accent",
       "parameter_initial_enable": 0,
       "parameter_type": 2,
       "parameter_enum": [
        "Off",
        "On"
       ],
       "parameter_mmax": 1
      }
     }
    }
   },
   {
    "box": {
     "id": "pv_slide",
     "maxclass": "live.menu",
     "patching_rect": [
      1090,
      68,
      80,
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
     "varname": "pv_slide",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "Slide",
       "parameter_shortname": "Slide",
       "parameter_initial_enable": 0,
       "parameter_type": 2,
       "parameter_enum": [
        "Off",
        "On"
       ],
       "parameter_mmax": 1
      }
     }
    }
   },
   {
    "box": {
     "id": "pv_tie",
     "maxclass": "live.menu",
     "patching_rect": [
      1090,
      92,
      80,
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
     "varname": "pv_tie",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "Tie",
       "parameter_shortname": "Tie",
       "parameter_initial_enable": 0,
       "parameter_type": 2,
       "parameter_enum": [
        "Off",
        "On"
       ],
       "parameter_mmax": 1
      }
     }
    }
   },
   {
    "box": {
     "id": "pv_fill",
     "maxclass": "live.menu",
     "patching_rect": [
      1090,
      116,
      80,
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
     "varname": "pv_fill",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "Fill",
       "parameter_shortname": "Fill",
       "parameter_initial_enable": 0,
       "parameter_type": 2,
       "parameter_enum": [
        "Off",
        "On"
       ],
       "parameter_mmax": 1
      }
     }
    }
   },
   {
    "box": {
     "id": "pv_condition",
     "maxclass": "live.menu",
     "patching_rect": [
      1090,
      140,
      80,
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
     "varname": "pv_condition",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "Cond",
       "parameter_shortname": "Cond",
       "parameter_initial_enable": 0,
       "parameter_type": 2,
       "parameter_enum": [
        "always",
        "1st",
        "!1st",
        "pre",
        "!pre",
        "1:2",
        "2:2",
        "1:3",
        "2:3",
        "3:3",
        "1:4",
        "2:4",
        "3:4",
        "4:4",
        "1:8",
        "2:8",
        "3:8",
        "4:8",
        "5:8",
        "6:8",
        "7:8",
        "8:8"
       ],
       "parameter_mmax": 21
      }
     }
    }
   },
   {
    "box": {
     "id": "pv_m1",
     "maxclass": "live.numbox",
     "patching_rect": [
      1090,
      164,
      80,
      15
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "pv_m1",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "Macro1",
       "parameter_shortname": "Macro 1",
       "parameter_initial_enable": 0,
       "parameter_type": 1,
       "parameter_mmin": -100,
       "parameter_mmax": 100,
       "parameter_unitstyle": 9,
       "parameter_units": "%d %%"
      }
     }
    }
   },
   {
    "box": {
     "id": "pv_m2",
     "maxclass": "live.numbox",
     "patching_rect": [
      1090,
      188,
      80,
      15
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "pv_m2",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "Macro2",
       "parameter_shortname": "Macro 2",
       "parameter_initial_enable": 0,
       "parameter_type": 1,
       "parameter_mmin": -100,
       "parameter_mmax": 100,
       "parameter_unitstyle": 9,
       "parameter_units": "%d %%"
      }
     }
    }
   },
   {
    "box": {
     "id": "pv_m3",
     "maxclass": "live.numbox",
     "patching_rect": [
      1090,
      212,
      80,
      15
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "pv_m3",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "Macro3",
       "parameter_shortname": "Macro 3",
       "parameter_initial_enable": 0,
       "parameter_type": 1,
       "parameter_mmin": -100,
       "parameter_mmax": 100,
       "parameter_unitstyle": 9,
       "parameter_units": "%d %%"
      }
     }
    }
   },
   {
    "box": {
     "id": "pv_m4",
     "maxclass": "live.numbox",
     "patching_rect": [
      1090,
      236,
      80,
      15
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "pv_m4",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "Macro4",
       "parameter_shortname": "Macro 4",
       "parameter_initial_enable": 0,
       "parameter_type": 1,
       "parameter_mmin": -100,
       "parameter_mmax": 100,
       "parameter_unitstyle": 9,
       "parameter_units": "%d %%"
      }
     }
    }
   },
   {
    "box": {
     "id": "pv_m5",
     "maxclass": "live.numbox",
     "patching_rect": [
      1090,
      260,
      80,
      15
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "pv_m5",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "Macro5",
       "parameter_shortname": "Macro 5",
       "parameter_initial_enable": 0,
       "parameter_type": 1,
       "parameter_mmin": -100,
       "parameter_mmax": 100,
       "parameter_unitstyle": 9,
       "parameter_units": "%d %%"
      }
     }
    }
   },
   {
    "box": {
     "id": "pv_m6",
     "maxclass": "live.numbox",
     "patching_rect": [
      1090,
      284,
      80,
      15
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "pv_m6",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "Macro6",
       "parameter_shortname": "Macro 6",
       "parameter_initial_enable": 0,
       "parameter_type": 1,
       "parameter_mmin": -100,
       "parameter_mmax": 100,
       "parameter_unitstyle": 9,
       "parameter_units": "%d %%"
      }
     }
    }
   },
   {
    "box": {
     "id": "pv_m7",
     "maxclass": "live.numbox",
     "patching_rect": [
      1180,
      20,
      80,
      15
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "pv_m7",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "Macro7",
       "parameter_shortname": "Macro 7",
       "parameter_initial_enable": 0,
       "parameter_type": 1,
       "parameter_mmin": -100,
       "parameter_mmax": 100,
       "parameter_unitstyle": 9,
       "parameter_units": "%d %%"
      }
     }
    }
   },
   {
    "box": {
     "id": "pv_m8",
     "maxclass": "live.numbox",
     "patching_rect": [
      1180,
      44,
      80,
      15
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "pv_m8",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "Macro8",
       "parameter_shortname": "Macro 8",
       "parameter_initial_enable": 0,
       "parameter_type": 1,
       "parameter_mmin": -100,
       "parameter_mmax": 100,
       "parameter_unitstyle": 9,
       "parameter_units": "%d %%"
      }
     }
    }
   },
   {
    "box": {
     "id": "pv_retrig",
     "maxclass": "live.menu",
     "patching_rect": [
      1180,
      68,
      80,
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
     "varname": "pv_retrig",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "Retrig",
       "parameter_shortname": "RTRG",
       "parameter_initial_enable": 0,
       "parameter_type": 2,
       "parameter_enum": [
        "Off",
        "On"
       ],
       "parameter_mmax": 1
      }
     }
    }
   },
   {
    "box": {
     "id": "pv_retrigRate",
     "maxclass": "live.menu",
     "patching_rect": [
      1180,
      92,
      80,
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
     "varname": "pv_retrigRate",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "RtRate",
       "parameter_shortname": "RATE",
       "parameter_initial_enable": 0,
       "parameter_type": 2,
       "parameter_enum": [
        "1/1",
        "1/2",
        "1/3",
        "1/4",
        "1/5",
        "1/6",
        "1/8",
        "1/10",
        "1/12",
        "1/16",
        "1/20",
        "1/24",
        "1/32",
        "1/40",
        "1/48",
        "1/64",
        "1/80"
       ],
       "parameter_mmax": 16
      }
     }
    }
   },
   {
    "box": {
     "id": "pv_retrigFade",
     "maxclass": "live.numbox",
     "patching_rect": [
      1180,
      116,
      80,
      15
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "pv_retrigFade",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "RtVFade",
       "parameter_shortname": "VFAD",
       "parameter_initial_enable": 0,
       "parameter_type": 1,
       "parameter_mmin": -100,
       "parameter_mmax": 100,
       "parameter_unitstyle": 9,
       "parameter_units": "%d %%"
      }
     }
    }
   },
   {
    "box": {
     "id": "pv_retrigCurve",
     "maxclass": "live.numbox",
     "patching_rect": [
      1180,
      140,
      80,
      15
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "pv_retrigCurve",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "RtCurve",
       "parameter_shortname": "CRV",
       "parameter_initial_enable": 0,
       "parameter_type": 1,
       "parameter_mmin": 0,
       "parameter_mmax": 100,
       "parameter_unitstyle": 9,
       "parameter_units": "%d %%"
      }
     }
    }
   },
   {
    "box": {
     "id": "pv_retrigProb",
     "maxclass": "live.numbox",
     "patching_rect": [
      1180,
      164,
      80,
      15
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "pv_retrigProb",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "RtProb",
       "parameter_shortname": "PROB",
       "parameter_initial_enable": 0,
       "parameter_type": 1,
       "parameter_mmin": 0,
       "parameter_mmax": 100,
       "parameter_unitstyle": 9,
       "parameter_units": "%d %%"
      }
     }
    }
   },
   {
    "box": {
     "id": "pv_retrigTRate",
     "maxclass": "live.menu",
     "patching_rect": [
      1180,
      188,
      80,
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
     "varname": "pv_retrigTRate",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "RtTRate",
       "parameter_shortname": "TRATE",
       "parameter_initial_enable": 0,
       "parameter_type": 2,
       "parameter_enum": [
        "Off",
        "1/1",
        "1/2",
        "1/3",
        "1/4",
        "1/5",
        "1/6",
        "1/8",
        "1/10",
        "1/12",
        "1/16",
        "1/20",
        "1/24",
        "1/32",
        "1/40",
        "1/48",
        "1/64",
        "1/80"
       ],
       "parameter_mmax": 17
      }
     }
    }
   },
   {
    "box": {
     "id": "pv_retrigGlide",
     "maxclass": "live.numbox",
     "patching_rect": [
      1180,
      212,
      80,
      15
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "pv_retrigGlide",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "RtGlide",
       "parameter_shortname": "GLIDE",
       "parameter_initial_enable": 0,
       "parameter_type": 0,
       "parameter_mmin": 0,
       "parameter_mmax": 128,
       "parameter_unitstyle": 9,
       "parameter_units": "%.2f st"
      }
     }
    }
   },
   {
    "box": {
     "id": "pv_retrigLock",
     "maxclass": "live.menu",
     "patching_rect": [
      1180,
      236,
      80,
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
     "varname": "pv_retrigLock",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "RtLock",
       "parameter_shortname": "LOCK",
       "parameter_initial_enable": 0,
       "parameter_type": 2,
       "parameter_enum": [
        "Off",
        "On"
       ],
       "parameter_mmax": 1
      }
     }
    }
   },
   {
    "box": {
     "id": "pv_retrigPMode",
     "maxclass": "live.menu",
     "patching_rect": [
      1180,
      260,
      80,
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
     "varname": "pv_retrigPMode",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "RtPMode",
       "parameter_shortname": "PMODE",
       "parameter_initial_enable": 0,
       "parameter_type": 2,
       "parameter_enum": [
        "Repeats",
        "Burst",
        "Note"
       ],
       "parameter_mmax": 2
      }
     }
    }
   },
   {
    "box": {
     "id": "pv_retrigVoices",
     "maxclass": "live.menu",
     "patching_rect": [
      1180,
      284,
      80,
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
     "varname": "pv_retrigVoices",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "RtVoices",
       "parameter_shortname": "VOICES",
       "parameter_initial_enable": 0,
       "parameter_type": 2,
       "parameter_enum": [
        "Mono",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8"
       ],
       "parameter_mmax": 7
      }
     }
    }
   },
   {
    "box": {
     "id": "pv_slideTime",
     "maxclass": "live.numbox",
     "patching_rect": [
      1270,
      20,
      80,
      15
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "pv_slideTime",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "SlTime",
       "parameter_shortname": "Sl Time",
       "parameter_initial_enable": 0,
       "parameter_type": 1,
       "parameter_mmin": 0,
       "parameter_mmax": 200,
       "parameter_unitstyle": 9,
       "parameter_units": "%d %%"
      }
     }
    }
   },
   {
    "box": {
     "id": "pv_slideCurve",
     "maxclass": "live.numbox",
     "patching_rect": [
      1270,
      44,
      80,
      15
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "pv_slideCurve",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "SlCurve",
       "parameter_shortname": "Sl Curve",
       "parameter_initial_enable": 0,
       "parameter_type": 1,
       "parameter_mmin": -100,
       "parameter_mmax": 100,
       "parameter_unitstyle": 0
      }
     }
    }
   },
   {
    "box": {
     "id": "pv_kLength",
     "maxclass": "live.numbox",
     "patching_rect": [
      1270,
      68,
      80,
      15
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "pv_kLength",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "KLength",
       "parameter_shortname": "Length",
       "parameter_initial_enable": 0,
       "parameter_type": 0,
       "parameter_mmin": 1,
       "parameter_mmax": 512,
       "parameter_unitstyle": 0
      }
     }
    }
   },
   {
    "box": {
     "id": "pv_kEuSteps",
     "maxclass": "live.numbox",
     "patching_rect": [
      1270,
      92,
      80,
      15
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "pv_kEuSteps",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "KEuSteps",
       "parameter_shortname": "Steps",
       "parameter_initial_enable": 0,
       "parameter_type": 1,
       "parameter_mmin": 1,
       "parameter_mmax": 64,
       "parameter_unitstyle": 0
      }
     }
    }
   },
   {
    "box": {
     "id": "pv_kEuPulses",
     "maxclass": "live.numbox",
     "patching_rect": [
      1270,
      116,
      80,
      15
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "pv_kEuPulses",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "KEuPulses",
       "parameter_shortname": "Pulses",
       "parameter_initial_enable": 0,
       "parameter_type": 1,
       "parameter_mmin": 0,
       "parameter_mmax": 64,
       "parameter_unitstyle": 0
      }
     }
    }
   },
   {
    "box": {
     "id": "pv_kEuRotate",
     "maxclass": "live.numbox",
     "patching_rect": [
      1270,
      140,
      80,
      15
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "pv_kEuRotate",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "KEuRotate",
       "parameter_shortname": "Rotate",
       "parameter_initial_enable": 0,
       "parameter_type": 1,
       "parameter_mmin": 0,
       "parameter_mmax": 63,
       "parameter_unitstyle": 0
      }
     }
    }
   },
   {
    "box": {
     "id": "pv_kEuLayer",
     "maxclass": "live.menu",
     "patching_rect": [
      1270,
      164,
      80,
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
     "varname": "pv_kEuLayer",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "KEuLayer",
       "parameter_shortname": "Layer",
       "parameter_initial_enable": 0,
       "parameter_type": 2,
       "parameter_enum": [
        "Manual",
        "Euclid",
        "Both"
       ],
       "parameter_mmax": 2
      }
     }
    }
   },
   {
    "box": {
     "id": "pv_kEuVel",
     "maxclass": "live.numbox",
     "patching_rect": [
      1270,
      188,
      80,
      15
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "pv_kEuVel",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "KEuVel",
       "parameter_shortname": "Velocity",
       "parameter_initial_enable": 0,
       "parameter_type": 1,
       "parameter_mmin": 1,
       "parameter_mmax": 127,
       "parameter_unitstyle": 0
      }
     }
    }
   },
   {
    "box": {
     "id": "pv_kEuFollow",
     "maxclass": "live.menu",
     "patching_rect": [
      1270,
      212,
      80,
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
     "varname": "pv_kEuFollow",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "KEuFollow",
       "parameter_shortname": "Follow",
       "parameter_initial_enable": 0,
       "parameter_type": 2,
       "parameter_enum": [
        "Off",
        "On"
       ],
       "parameter_mmax": 1
      }
     }
    }
   },
   {
    "box": {
     "id": "pv_bLength",
     "maxclass": "live.numbox",
     "patching_rect": [
      1270,
      236,
      80,
      15
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "pv_bLength",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "BLength",
       "parameter_shortname": "Length",
       "parameter_initial_enable": 0,
       "parameter_type": 0,
       "parameter_mmin": 1,
       "parameter_mmax": 512,
       "parameter_unitstyle": 0
      }
     }
    }
   },
   {
    "box": {
     "id": "pv_bEuSteps",
     "maxclass": "live.numbox",
     "patching_rect": [
      1270,
      260,
      80,
      15
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "pv_bEuSteps",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "BEuSteps",
       "parameter_shortname": "Steps",
       "parameter_initial_enable": 0,
       "parameter_type": 1,
       "parameter_mmin": 1,
       "parameter_mmax": 64,
       "parameter_unitstyle": 0
      }
     }
    }
   },
   {
    "box": {
     "id": "pv_bEuPulses",
     "maxclass": "live.numbox",
     "patching_rect": [
      1270,
      284,
      80,
      15
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "pv_bEuPulses",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "BEuPulses",
       "parameter_shortname": "Pulses",
       "parameter_initial_enable": 0,
       "parameter_type": 1,
       "parameter_mmin": 0,
       "parameter_mmax": 64,
       "parameter_unitstyle": 0
      }
     }
    }
   },
   {
    "box": {
     "id": "pv_bEuRotate",
     "maxclass": "live.numbox",
     "patching_rect": [
      1360,
      20,
      80,
      15
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "pv_bEuRotate",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "BEuRotate",
       "parameter_shortname": "Rotate",
       "parameter_initial_enable": 0,
       "parameter_type": 1,
       "parameter_mmin": 0,
       "parameter_mmax": 63,
       "parameter_unitstyle": 0
      }
     }
    }
   },
   {
    "box": {
     "id": "pv_bEuLayer",
     "maxclass": "live.menu",
     "patching_rect": [
      1360,
      44,
      80,
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
     "varname": "pv_bEuLayer",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "BEuLayer",
       "parameter_shortname": "Layer",
       "parameter_initial_enable": 0,
       "parameter_type": 2,
       "parameter_enum": [
        "Manual",
        "Euclid",
        "Both"
       ],
       "parameter_mmax": 2
      }
     }
    }
   },
   {
    "box": {
     "id": "pv_bEuVel",
     "maxclass": "live.numbox",
     "patching_rect": [
      1360,
      68,
      80,
      15
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "pv_bEuVel",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "BEuVel",
       "parameter_shortname": "Velocity",
       "parameter_initial_enable": 0,
       "parameter_type": 1,
       "parameter_mmin": 1,
       "parameter_mmax": 127,
       "parameter_unitstyle": 0
      }
     }
    }
   },
   {
    "box": {
     "id": "pv_bEuFollow",
     "maxclass": "live.menu",
     "patching_rect": [
      1360,
      92,
      80,
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
     "varname": "pv_bEuFollow",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "BEuFollow",
       "parameter_shortname": "Follow",
       "parameter_initial_enable": 0,
       "parameter_type": 2,
       "parameter_enum": [
        "Off",
        "On"
       ],
       "parameter_mmax": 1
      }
     }
    }
   },
   {
    "box": {
     "id": "pv_bEuNote",
     "maxclass": "live.numbox",
     "patching_rect": [
      1360,
      116,
      80,
      15
     ],
     "numinlets": 1,
     "numoutlets": 2,
     "outlettype": [
      "",
      "float"
     ],
     "parameter_enable": 1,
     "varname": "pv_bEuNote",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "BEuNote",
       "parameter_shortname": "Note",
       "parameter_initial_enable": 0,
       "parameter_type": 1,
       "parameter_mmin": 0,
       "parameter_mmax": 127,
       "parameter_unitstyle": 8
      }
     }
    }
   },
   {
    "box": {
     "id": "c_takeover",
     "maxclass": "comment",
     "patching_rect": [
      1000,
      400,
      60,
      20
     ],
     "presentation": 1,
     "presentation_rect": [
      10,
      46,
      50,
      18
     ],
     "text": "Takeover",
     "numinlets": 1,
     "numoutlets": 0
    }
   },
   {
    "box": {
     "id": "pre_takeover",
     "maxclass": "newobj",
     "patching_rect": [
      1000,
      420,
      100,
      22
     ],
     "text": "prepend takeover",
     "numinlets": 1,
     "numoutlets": 1,
     "outlettype": [
      ""
     ]
    }
   },
   {
    "box": {
     "id": "banks",
     "maxclass": "newobj",
     "patching_rect": [
      1000,
      330,
      70,
      22
     ],
     "text": "live.banks",
     "numinlets": 1,
     "numoutlets": 1,
     "outlettype": [
      ""
     ],
     "varname": "banks"
    }
   },
   {
    "box": {
     "id": "pre_banks",
     "maxclass": "newobj",
     "patching_rect": [
      1000,
      360,
      90,
      22
     ],
     "text": "prepend banks",
     "numinlets": 1,
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
      "clk_once",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "clk_once",
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
      "clk_poll",
      0
     ],
     "destination": [
      "clk_tr2",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "clk_tr2",
      6
     ],
     "destination": [
      "clk_run",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "clk_run",
      0
     ],
     "destination": [
      "clk_edge",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "clk_edge",
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
      "clk_edge",
      1
     ],
     "destination": [
      "clk_reset",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "clk_reset",
      0
     ],
     "destination": [
      "clk_once",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "ev_t",
      0
     ],
     "destination": [
      "ev_rest",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "ev_t",
      1
     ],
     "destination": [
      "ev_off",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "ev_off",
      0
     ],
     "destination": [
      "ev_pipe",
      5
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "ev_rest",
      1
     ],
     "destination": [
      "ev_pipe",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "ev_pipe",
      0
     ],
     "destination": [
      "ev_pack",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "ev_pipe",
      1
     ],
     "destination": [
      "ev_pack",
      1
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "ev_pipe",
      2
     ],
     "destination": [
      "ev_pack",
      2
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "ev_pipe",
      3
     ],
     "destination": [
      "ev_pack",
      3
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "ev_pipe",
      4
     ],
     "destination": [
      "ev_pack",
      4
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
      "ev_t",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "ev_pack",
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
      "clk_edge",
      1
     ],
     "destination": [
      "ev_clear",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "ev_clear",
      0
     ],
     "destination": [
      "ev_pipe",
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
      "ev_route",
      2
     ],
     "destination": [
      "pb_unpack",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "pb_unpack",
      3
     ],
     "destination": [
      "pb_pack",
      1
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "pb_unpack",
      0
     ],
     "destination": [
      "pb_pack",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "pb_pack",
      0
     ],
     "destination": [
      "pb_t",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "pb_t",
      2
     ],
     "destination": [
      "pb_msb",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "pb_t",
      1
     ],
     "destination": [
      "pb_lsb",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "pb_t",
      0
     ],
     "destination": [
      "pb_st",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "pb_msb",
      0
     ],
     "destination": [
      "pb_bytes",
      2
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "pb_lsb",
      0
     ],
     "destination": [
      "pb_bytes",
      1
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "pb_st",
      0
     ],
     "destination": [
      "pb_bytes",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "pb_bytes",
      0
     ],
     "destination": [
      "pb_iter",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "pb_iter",
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
      "pb_iter",
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
      "ev_route",
      3
     ],
     "destination": [
      "mac0_slice",
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
      "mac0_pack",
      2
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "mac0_slice",
      0
     ],
     "destination": [
      "mac0_pack",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "mac0_pack",
      0
     ],
     "destination": [
      "mac0_pre",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "mac0_pre",
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
      4
     ],
     "destination": [
      "mac1_slice",
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
      "mac1_pack",
      2
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "mac1_slice",
      0
     ],
     "destination": [
      "mac1_pack",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "mac1_pack",
      0
     ],
     "destination": [
      "mac1_pre",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "mac1_pre",
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
      "info_recv",
      0
     ],
     "destination": [
      "info_pre",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "info_pre",
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
      "group_pre",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "group_pre",
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
   },
   {
    "patchline": {
     "source": [
      "pv_takeover",
      0
     ],
     "destination": [
      "pre_takeover",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "pre_takeover",
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
      "banks",
      0
     ],
     "destination": [
      "pre_banks",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "pre_banks",
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
   "pv_kickChannel": [
    "KickCh",
    "Kick Ch",
    0
   ],
   "pv_bassChannel": [
    "BassCh",
    "Bass Ch",
    0
   ],
   "pv_kickNote": [
    "KickNote",
    "Kick Note",
    0
   ],
   "pv_bendRange": [
    "BendRange",
    "Bend",
    0
   ],
   "pv_scaleFollow": [
    "ScaleFollow",
    "Scale",
    0
   ],
   "pv_swing": [
    "Swing",
    "Swing",
    0
   ],
   "pv_macroRefresh": [
    "MacroRefresh",
    "Refresh",
    0
   ],
   "pv_takeover": [
    "Takeover",
    "Takeover",
    0
   ],
   "pv_note": [
    "Note",
    "Note",
    0
   ],
   "pv_velocity": [
    "Velocity",
    "Velocity",
    0
   ],
   "pv_length": [
    "Length",
    "Length",
    0
   ],
   "pv_microtime": [
    "Micro",
    "Micro",
    0
   ],
   "pv_probability": [
    "Prob",
    "Prob",
    0
   ],
   "pv_accent": [
    "Accent",
    "Accent",
    0
   ],
   "pv_slide": [
    "Slide",
    "Slide",
    0
   ],
   "pv_tie": [
    "Tie",
    "Tie",
    0
   ],
   "pv_fill": [
    "Fill",
    "Fill",
    0
   ],
   "pv_condition": [
    "Cond",
    "Cond",
    0
   ],
   "pv_m1": [
    "Macro1",
    "Macro 1",
    0
   ],
   "pv_m2": [
    "Macro2",
    "Macro 2",
    0
   ],
   "pv_m3": [
    "Macro3",
    "Macro 3",
    0
   ],
   "pv_m4": [
    "Macro4",
    "Macro 4",
    0
   ],
   "pv_m5": [
    "Macro5",
    "Macro 5",
    0
   ],
   "pv_m6": [
    "Macro6",
    "Macro 6",
    0
   ],
   "pv_m7": [
    "Macro7",
    "Macro 7",
    0
   ],
   "pv_m8": [
    "Macro8",
    "Macro 8",
    0
   ],
   "pv_retrig": [
    "Retrig",
    "RTRG",
    0
   ],
   "pv_retrigRate": [
    "RtRate",
    "RATE",
    0
   ],
   "pv_retrigFade": [
    "RtVFade",
    "VFAD",
    0
   ],
   "pv_retrigCurve": [
    "RtCurve",
    "CRV",
    0
   ],
   "pv_retrigProb": [
    "RtProb",
    "PROB",
    0
   ],
   "pv_retrigTRate": [
    "RtTRate",
    "TRATE",
    0
   ],
   "pv_retrigGlide": [
    "RtGlide",
    "GLIDE",
    0
   ],
   "pv_retrigLock": [
    "RtLock",
    "LOCK",
    0
   ],
   "pv_retrigPMode": [
    "RtPMode",
    "PMODE",
    0
   ],
   "pv_retrigVoices": [
    "RtVoices",
    "VOICES",
    0
   ],
   "pv_slideTime": [
    "SlTime",
    "Sl Time",
    0
   ],
   "pv_slideCurve": [
    "SlCurve",
    "Sl Curve",
    0
   ],
   "pv_kLength": [
    "KLength",
    "Length",
    0
   ],
   "pv_kEuSteps": [
    "KEuSteps",
    "Steps",
    0
   ],
   "pv_kEuPulses": [
    "KEuPulses",
    "Pulses",
    0
   ],
   "pv_kEuRotate": [
    "KEuRotate",
    "Rotate",
    0
   ],
   "pv_kEuLayer": [
    "KEuLayer",
    "Layer",
    0
   ],
   "pv_kEuVel": [
    "KEuVel",
    "Velocity",
    0
   ],
   "pv_kEuFollow": [
    "KEuFollow",
    "Follow",
    0
   ],
   "pv_bLength": [
    "BLength",
    "Length",
    0
   ],
   "pv_bEuSteps": [
    "BEuSteps",
    "Steps",
    0
   ],
   "pv_bEuPulses": [
    "BEuPulses",
    "Pulses",
    0
   ],
   "pv_bEuRotate": [
    "BEuRotate",
    "Rotate",
    0
   ],
   "pv_bEuLayer": [
    "BEuLayer",
    "Layer",
    0
   ],
   "pv_bEuVel": [
    "BEuVel",
    "Velocity",
    0
   ],
   "pv_bEuFollow": [
    "BEuFollow",
    "Follow",
    0
   ],
   "pv_bEuNote": [
    "BEuNote",
    "Note",
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