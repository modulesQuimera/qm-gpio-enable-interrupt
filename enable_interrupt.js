module.exports = function(RED) {

    // "use strict";
    var mapeamentoNode;

    function enable_interruptNode(config) {
        RED.nodes.createNode(this, config);
        this.serial = config.serial;
        this.serialConfig = RED.nodes.getNode(this.serial);
        this.mapeamento = config.mapeamento;
        this.edge = config.edge;
        this.port = config.port;
        
        this.qtdGpio = config.qtdGpio;
 
        var node = this;
        mapeamentoNode = RED.nodes.getNode(this.mapeamento);

        node.on('input', function(msg, send, done) {

            var globalContext = node.context().global;
            var currentMode = globalContext.get("currentMode");
            var command = {
                type: "GPIO_modular_V1_0",
                slot: parseInt(mapeamentoNode.slot),
                method: "enable_interrupt",
                edge: parseInt(node.edge),
                GPIO_number: parseInt(node.port), 
                get_output: {},
                // compare: _compare
            }
            var file = globalContext.get("exportFile");
            var slot = globalContext.get("slot");

            if(!(slot === "begin" || slot === "end")){
                if(currentMode == "test"){
                    file.slots[slot].jig_test.push(command);
                }
                else{
                    file.slots[slot].jig_error.push(command);
                }
            }
            else{
                if(slot === "begin"){
                    file.slots[0].jig_test.push(command);
                }
                else{
                    file.slots[3].jig_test.push(command);
                }
            }
            globalContext.set("exportFile", file);
            send(msg);
            console.log(command);
        });
    }

    RED.nodes.registerType("enable_interrupt", enable_interruptNode);
};