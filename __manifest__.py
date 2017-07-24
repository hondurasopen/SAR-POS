# -*- coding: utf-8 -*-
{
    'name': 'POS Sequence Ref Number',
    'version': '10.0',
    'category': 'Point Of Sale',
    'sequence': 1,
    'author': "Honduras, César Alejandro Rodriguez",
    'summary': 'Sequential Order numbers for Point of sale',
    'depends': [
        "point_of_sale",
    ],
    'data': [
        'views/pos_template.xml'
    ],
    'qweb': [
        'static/src/xml/pos.xml'
    ],
    'installable': True,
    'application': False,
    'auto_install': False,
}
