using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.UI;
using VampPon.UnitySpike.Runtime.Gameplay.Definitions;
using VampPon.UnitySpike.Runtime.Gameplay.State;

namespace VampPon.UnitySpike.Runtime.Gameplay
{
    public sealed class InventoryHudViewModel { public readonly List<string> Weapons=new(); public readonly List<string> Passives=new(); public readonly List<string> Rares=new(); }
    public sealed class U47InventoryHudPresenter : MonoBehaviour
    {
        private Stage1GameplayRuntimeCoordinator gameplay; private TextMeshProUGUI label; private string lastText;
        public void Build(Transform parent, TMP_FontAsset font, Stage1GameplayRuntimeCoordinator runtime)
        {
            gameplay=runtime; var root=new GameObject("U47ActualInventoryHud",typeof(RectTransform),typeof(Image)); root.transform.SetParent(parent,false); var rect=root.GetComponent<RectTransform>(); rect.anchorMin=new Vector2(.5f,0); rect.anchorMax=new Vector2(.5f,0); rect.pivot=new Vector2(.5f,0); rect.anchoredPosition=new Vector2(0,72); rect.sizeDelta=new Vector2(350,72); root.GetComponent<Image>().color=new Color(.035f,.025f,.025f,.72f);
            var text=new GameObject("InventoryStateLabel",typeof(RectTransform),typeof(TextMeshProUGUI)); text.transform.SetParent(root.transform,false); var tr=text.GetComponent<RectTransform>(); tr.anchorMin=Vector2.zero;tr.anchorMax=Vector2.one;tr.offsetMin=new Vector2(8,4);tr.offsetMax=new Vector2(-8,-4); label=text.GetComponent<TextMeshProUGUI>();label.font=font;label.fontSize=10;label.alignment=TextAlignmentOptions.Center;label.color=new Color(.93f,.83f,.65f);label.enableWordWrapping=true;
            gameplay.RuntimeChanged+=Refresh; Refresh();
        }
        public InventoryHudViewModel BuildViewModel() { var vm=new InventoryHudViewModel(); foreach(var item in gameplay.Run.Inventory.Weapons){var d=gameplay.Registry.GetWeapon(item.Id);vm.Weapons.Add($"{d.DisplayName} {(d.IsEvolved?"進化 ":"")}Lv{item.Level}/{d.MaxLevel}");} while(vm.Weapons.Count<gameplay.Registry.WeaponSlots)vm.Weapons.Add("—"); foreach(var item in gameplay.Run.Inventory.Passives){var d=gameplay.Registry.GetPassive(item.Id);vm.Passives.Add($"{d.DisplayName} Lv{item.Level}/{d.MaxLevel}");} while(vm.Passives.Count<gameplay.Registry.PassiveSlots)vm.Passives.Add("—"); foreach(var item in gameplay.Run.Inventory.RareItems)vm.Rares.Add(gameplay.Registry.GetRareItem(item.Id).DisplayName); while(vm.Rares.Count<gameplay.Registry.RareItemSlots)vm.Rares.Add("—"); return vm; }
        private void Update()=>Refresh();
        private void Refresh(){if(label==null||gameplay?.Run==null)return;var vm=BuildViewModel();var phase=gameplay.Run.Kokuyou.Phase switch{KokuyouPhase.Idle=>"待機",KokuyouPhase.Charging=>"蓄積",KokuyouPhase.Ready=>"発動可",KokuyouPhase.Activating=>"発動",KokuyouPhase.Active=>"黒耀化中",KokuyouPhase.Ending=>"終了",_=>"回復"};var text=$"HP {gameplay.Run.Player.CurrentHp:0}/{gameplay.Run.Player.MaxHp:0}　黒耀化 {phase} {gameplay.Run.Kokuyou.Gauge:0}/100\n武器  {string.Join(" / ",vm.Weapons)}\n補助  {string.Join(" / ",vm.Passives)}\nレア  {string.Join(" / ",vm.Rares)}";if(text==lastText)return;lastText=text;label.text=text;}
        private void OnDestroy(){if(gameplay!=null)gameplay.RuntimeChanged-=Refresh;}
    }
}
