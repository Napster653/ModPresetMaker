const modListString = `@Academia
@ace
@ace_complementos
@ace_complementos_vn
@ACE_KAT
@acre2
@acre2_compat_ffaa
@acre2_compat_rhs_usaf
@acre2_compat_SOG
@adv_aceCPR
@ALiVE
@AlphaGroupEquipment
@Breaching_charge
@BRIDGE_Knocking
@CBA_A3
@coches
@coches_SOF
@cosas
@cTab
@CUP_Factions
@CUP_Interiors
@CUP_Terrains_ACE_Compat
@CUP_Terrains_Core
@CUP_Terrains_Maps
@CUP_Units
@CUP_Vehicles
@CUP_Vehicles_ACE_compat
@CUP_vehicles_coches_fix
@CUP_Weapons
@CUP_Weapons_ACE_compat
@EODS
@EODS_Sanchez
@estructuras_sof
@FOW
@Hatchet Framework - Stable Version
@Hatchet H-60 pack - Stable Version
@IFA3_ACE_Compat
@IFA3_AIO
@IFA3_FOW_Compat
@JBAD
@JBAD_fix
@LAMBS
@LAMBS_compat_CUP
@LAMBS_compat_RHS
@LYTHIUM_casas
@M224 60mm Mortar
@MAP_Albasrah
@MAP_Anizay
@MAP_Archipelago
@MAP_Bozoum
@MAP_Chernarus2035
@MAP_Clafghan
@MAP_Elborma
@MAP_FATA
@MAP_Korsac
@MAP_Kujari
@MAP_LYTHIUM
@MAP_Majan
@MAP_Mandol
@MAP_North Takistan
@MAP_Ruha
@MAP_Sumava
@MAP_Suursaari
@MAP_TORA
@MAP_Uzbin
@MAP_Virolahti
@MAP_YAPAL
@MATV
@Max_Women
@MCN_Aliabad
@MH-47G
@Northern_Fronts_Terrains
@Northern_Fronts_Units
@Pack_Press
@photo_cam
@Quad6x6
@RHSAFRF
@RHSGREF
@RHSSAF
@RHSUSAF
@RHSUSAF_ISOF
@RUG_DSAI
@S and S
@S and S - New Wave
@Second Assault
@seleccion_sof
@SimplexSS
@sonidos
@SQA
@SQA_factions_AFGN
@SQA_factions_RF
@SQA_USSR_60
@vn_extra
@VTN_TOYOTA
@VTN_TOYOTA_CUPFAC
@Zeus Enhanced
@Zeus Enhanced - ACE3 Compatibility
@ZHC`;

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
    modNames = ['@ace', '@ace_complementos', '@ACE_KAT', '@acre2', '@ALiVE', '@CBA_A3', '@LAMBS', '@Zeus Enhanced', '@Zeus Enhanced - ACE3 Compatibility'];
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
