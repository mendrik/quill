module quill {

    import Widget    = feather.core.Widget
    import Template  = feather.annotations.Template
    import Rest      = feather.xhr.Rest
    import Bind      = feather.observe.Bind

    export class VersionValues extends Widget {

        @Bind() version: Version
        nodes: ValueNode[]

        constructor(version: Version) {
            super()
            this.version = version
        }

        init(el: Element) {
            this.loadVersionValues()
        }

        @Rest({url: '/values/version/{{version.id}}', headers: quill.headers})
        loadVersionValues() {
            // ignore
        }

        @Template()
        markup() {
            return `
             <li>
                <div class="level version-header">
                    <div class="level-left">
                        <span class="level-item">
                            <span class="icon is-small"><Icon name="book"/></span>
                            <span class="version-name">{{version.name}}</span>
                        </span>
                    </div>
                    <div class="level-right">
                        <a class="button is-small tooltip" action="version-github" data-tooltip="Upload to github">
                            <Icon name="github" icon-class="is-small"/>
                        </a>
                        <a class="button is-small tooltip" action="version-download" data-tooltip="Download full JSON">
                            <Icon name="download" icon-class="is-small"/>
                        </a>
                        <a class="button is-small tooltip" action="version-configure" data-tooltip="Configure version">
                            <Icon name="cog" icon-class="is-small"/>
                        </a>
                    </div>
                </div>
                <scroll-receiver>
                    Nu Bass  <br>Nichol Cumbie  <br>Lenna Piercy  <br>See Aispuro  <br>
                    Sophie Troyer  <br>Bryan Cool  <br>Sylvia Mabe  <br>Hue Keele  <br>
                    Kaylee Speaks  <br>Milda Costin  <br>Jennie Dietrich  <br>Reanna Leanos  <br>
                    Ruby Dehn  <br>Asa Estes  <br>Tennie Steverson  <br>Despina Schnur  <br>
                    Lakeisha Getman  <br>Mara Heng  <br>Carroll Down  <br>Florencio Fazzino  <br>
                    Hailey Causey  <br>Babara Friscia  <br>Chanell Stgermain  <br>Annette Deangelis  <br>
                    Sulema Pulley  <br>Kylee Penman  <br>Ariel Pridgen  <br>Mitch Granado  <br>
                    Vernia Dates  <br>Darnell Pablo  <br>Anneliese Alderman  <br>Brad Dahl  <br>
                    Valentin Amburgey  <br>Kemberly Pelzer  <br>Ronald Boney  <br>Adah Boateng  <br>
                    Marcelina Alls  <br>Felicia Guss  <br>Linn Mershon  <br>Chere Scioneaux  <br>
                    Madalyn Glisson  <br>Kimberely Hagwood  <br>Roxanne Ouimet  <br>Annalisa Armagost  <br>
                    Doris Troy  <br>Angeline Shelor  <br>Zada Manjarrez  <br>Marvella Ritch  <br>
                    Larisa Burruel  <br>Margrett Canino  <br><br>
                </scroll-receiver>
            </li>`
        }
    }
}
