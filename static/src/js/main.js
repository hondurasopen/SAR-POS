odoo.define('pos_sequence_ref_number.main', function (require) {
    "use strict";
    var models = require('point_of_sale.models');
    var core = require('web.core');
    var _lt = core._lt;
    var QWeb = core.qweb;
    var _t = core._t;

    var _sequence_next = function(seq){
        var idict = {
            'year': moment().format('YYYY'),
            'month': moment().format('MM'),
            'day': moment().format('DD'),
            'y': moment().format('YY')
        };
        var format = function(s, dict){
            s = s || '';
            $.each(dict, function(k, v){
                s = s.replace('%(' + k + ')s', v);
            });
            return s;
        };
        function pad(n, width, z) {
            z = z || '0';
            n = n + '';
            if (n.length < width) {
                n = new Array(width - n.length + 1).join(z) + n;
            }
            return n;
        }
        var num = seq.number_next_actual;
        var prefix = format(seq.prefix, idict);
        var suffix = format(seq.suffix, idict);
        seq.number_next_actual += seq.number_increment;

        return prefix + pad(num, seq.padding) + suffix;
    };

    var posmodel_super = models.PosModel.prototype;
    models.PosModel = models.PosModel.extend({
        load_server_data: function(){
            var self = this;
            // Load POS sequence object
            models.load_models({
                model: 'ir.sequence',
                fields: [],
                ids:    function(self){ return [self.config.sequence_id[0]]; },
                loaded: function(self, sequence){ self.pos_order_sequence = sequence[0]; },
            });
            return posmodel_super.load_server_data.apply(this, arguments);
        },
        push_order: function(order, opts) {
            if (order !== undefined) {
                order.set({'sequence_ref_number': this.pos_order_sequence.number_next_actual});
                order.set({'sequence_ref': _sequence_next(this.pos_order_sequence)});
            }
            return posmodel_super.push_order.call(this, order);
        },
        push_and_invoice_order: function(order){
            if (order !== undefined) {
                order.set({'sequence_ref_number': this.pos_order_sequence.number_next_actual});
                order.set({'sequence_ref': _sequence_next(this.pos_order_sequence)});
            }
            return posmodel_super.push_and_invoice_order.call(this, order);
        },
    });

    var posorder_super = models.Order.prototype;
    models.Order = models.Order.extend({
        export_as_JSON: function() {
            var json = posorder_super.export_as_JSON.apply(this,arguments);
            json.sequence_ref = this.sequence_ref || false;    
            return json;
        },
        export_for_printing: function(){
            var json = posorder_super.export_for_printing.apply(this,arguments);
            json.sequence_ref_number = this.sequence_ref_number || false;
            return json;
        },
        
    });

});
