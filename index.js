// Command to get the list of directories in the current folder:
// PowerShell: Get-ChildItem -Directory | Select-Object Name

const modListString = `@A3TI REAP-IR
@Academia
@ace
@ace_complementos
@ace_complementos_vn
@ace_complementos_ww2
@ACE_KAT
@acre2
@AIF_WW2
@ALiVE
@AlphaGroupEquipment
@Antonov_An-2
@Breaching_charge
@BRIDGE_Knocking
@CBA_A3
@coches
@coches_fix
@coches_SOF
@cosas
@cTab
@CUP_Factions
@CUP_Interiors
@CUP_Terrains_Core
@CUP_Terrains_Maps
@CUP_Units
@CUP_Vehicles
@CUP_Weapons
@EODS
@EODS_Sanchez
@estructuras_sof
@FFAA
@FOW
@FPV Drone Crocus
@Hatchet Framework - Stable Version
@Hatchet H-60 pack - Stable Version
@IFA3_ACE_Compat
@IFA3_ACRE_Compat
@IFA3_AIO
@JBAD
@JBAD_fix
@LAFS - Light AI Fire Support
@LAMBS
@LAMBS_compat
@Leopard_2A6
@LYTHIUM_casas
@M224 60mm Mortar
@MAP_Albasrah
@MAP_AliabadRegion
@MAP_Bastogne1944
@MAP_Bozoum
@MAP_Chernarus2020
@MAP_Chernarus2035
@MAP_Clafghan
@MAP_FATA
@MAP_Hazar-KotValley
@MAP_HurtgenForest
@MAP_Korsac
@MAP_Kujari
@MAP_KunduzRiver
@MAP_LYTHIUM
@MAP_Majan
@MAP_Mandol
@MAP_North Takistan
@MAP_PegasusBridge
@MAP_Prokhorovka1943
@MAP_Ruha
@MAP_Sahatra
@MAP_Sumava
@MAP_Suursaari
@MAP_Uzbin
@MAP_Virolahti
@map_yulakia
@MATV
@MH-47G
@Northern_Fronts_Terrains
@PLA
@RHSAFRF
@RHSGREF
@RHSSAF
@RHSUSAF
@RHSUSAF_ISOF
@RUG_DSAI
@S and S
@S and S - Marpat
@S and S - New Wave
@Second Assault
@seleccion_sof
@Simplex
@SimplexSS
@sonidos
@Speshal_Animate
@Speshal_Breach
@Speshal_Core
@Speshal_Melee
@SPE
@SPEX - Spearhead Extended
@SQA
@SQA_factions_AFGN
@SQA_factions_cartel_mencey
@SQA_factions_RF
@sqa_factions_vn
@SQA_lambs
@SQA_lambs integration
@SQA_UAV
@SQA_UAV_nw
@SQA_USSR_60
@tklama_m119a3
@tklama_mortars
@ucm_utilities_construction_mod
@us_general_equipment_and_accessories
@USAF Mod - Main
@USAF_AC130_BETA
@vn
@vn_extra
@VTN_TOYOTA
@VTN_TOYOTA_CUPFAC
@Zeus Enhanced`;

function createModList()
{
    const modList = modListString.split('\n');
    const numMods = modList.length;
    const numRows = Math.ceil(numMods / 6);
    const modListElement = document.getElementById('modList');

    for (let colIndex = 0; colIndex < 6; colIndex++)
    {
        const colElement = document.createElement('div');
        colElement.classList.add('col');
        modListElement.appendChild(colElement);

        for (let rowIndex = 0; rowIndex < numRows; rowIndex++)
        {
            const modIndex = colIndex * numRows + rowIndex;
            if (modIndex >= numMods)
            {
                break;
            }
            const mod = modList[modIndex];
            const modName = mod.replace('@', '');
            const modItem = createModItem(mod, modName);
            colElement.appendChild(modItem);
        }
    }
}

function createModItem(mod, modName)
{
    const modItem = document.createElement('div');
    modItem.classList.add('form-group');
    modItem.innerHTML = `
        <label class="my-1">
          <input type="checkbox" class="form-check-input" name="mod[]" value="${mod}">
          ${mod}
        </label>
    `;

    const checkbox = modItem.querySelector('input[type="checkbox"]');
    checkbox.addEventListener('change', updateModCounter);

    return modItem;
}

function updateModCounter()
{
    const numChecked = document.querySelectorAll('input[name="mod[]"]:checked').length;
    const modCounter = document.getElementById('modCounter');
    modCounter.textContent = `${numChecked} mod${numChecked !== 1 ? 's' : ''} seleccionados`;
}

function handlePresetFileInputChange(event)
{
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', (event) =>
    {
        const parser = new DOMParser();
        const xml = parser.parseFromString(event.target.result, 'application/xml');
        const modNodes = xml.querySelectorAll('tr[data-type="ModContainer"] td[data-type="DisplayName"]');
        const modNames = Array.from(modNodes).map((node) => node.textContent);
        const checkboxes = document.getElementsByName('mod[]');
        checkboxes.forEach((checkbox) =>
        {
            checkbox.checked = false;
        });
        for (const modName of modNames)
        {
            var modFound = false;
            for (const checkbox of checkboxes)
            {
                if (modName == checkbox.value)
                {
                    checkbox.checked = true;
                    modFound = true;
                    break;
                }
            }
            if (!modFound)
            {
                console.error('Mod' + modName + 'could not be found in the list.')
            }
        }
        const presetNameInput = document.getElementById('presetNameInput');
        presetNameInput.value = file.name.endsWith('.html') ? file.name.slice(0, -5) : file.name;
        updateModCounter();
    });
    reader.readAsText(file);
}

function handleExportButtonClick()
{
    const selectedMods = Array.from(document.querySelectorAll('input[name="mod[]"]:checked')).map((checkbox) => checkbox.value);
    const presetNameInput = document.getElementById('presetNameInput');
    let presetName = presetNameInput.value.trim();
    if (!presetName)
    {
        presetName = 'preset.html';
    }
    if (!presetName.endsWith('.html'))
    {
        presetName += '.html';
    }
    const xmlString = generateXMLString(selectedMods);
    const blob = new Blob([xmlString], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, presetName);
}

function generateXMLString(selectedMods)
{
    return `<table>\n${selectedMods.map((mod) => `  <tr data-type="ModContainer">\n    <td data-type="DisplayName">${mod}</td>\n  </tr>`).join('\n')}\n</table>`;
}

function markRequiredMods()
{
    modNames = ['@ace', '@ace_complementos', '@ACE_KAT', '@acre2', '@ALiVE', '@CBA_A3', '@LAMBS', '@SQA', '@Zeus Enhanced', '@Zeus Enhanced - ACE3 Compatibility'];
    const checkboxes = document.getElementsByName('mod[]');
    for (const modName of modNames)
    {
        var modFound = false;
        for (const checkbox of checkboxes)
        {
            if (modName == checkbox.value)
            {
                checkbox.checked = true;
                modFound = true;
                break;
            }
        }
        if (!modFound)
        {
            console.error('Mod' + modName + 'could not be found in the list.')
        }
    }
    updateModCounter();
}

// Initialize mod list
createModList();

// Event listeners
document.getElementById('presetFileInput').addEventListener('change', handlePresetFileInputChange);
document.getElementById('exportPresetButton').addEventListener('click', handleExportButtonClick);
document.getElementById('btn-marcar-mods-obligatorios').addEventListener('click', markRequiredMods);
