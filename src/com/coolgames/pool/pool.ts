import { Reusable } from "./reusable";

export class Pool {
    private static _instance:Pool;
    
    protected _reusablesFree:Array<Reusable>;
    protected _reusablesUsed:Array<Reusable>;
    
    private constructor() {
        this._reusablesFree = new Array<Reusable>();
        this._reusablesUsed = new Array<Reusable>();
    }
    
    public static get instance(): Pool {
        if (!Pool._instance) {
            Pool._instance = new Pool();
        }
        
        return Pool._instance;
    }
    
    public addReusable(reusable: Reusable) {
        this._reusablesFree.push(reusable);
    }
    
    public acquire(id: string): Reusable {
        var length: number = this._reusablesFree.length;
        var reusable: Reusable;
        
        for (var i: number = 0; i < length; i++) {
            if (this._reusablesFree[i].id == id) {
                reusable = this._reusablesFree.splice(i, 1)[0];
                this._reusablesUsed.push(reusable);
                
                return reusable;
            }
        }
        
        return null;
    }
    
    public release(reusable: Reusable)
    {
        var length: number = this._reusablesUsed.length;
        
        for (var i: number = 0; i < length; i++) {
            if (this._reusablesUsed[i] == reusable) {
                this._reusablesFree.push(this._reusablesUsed.splice(i, 1)[0]);
                break;
            }
        }
    }
    
    public releaseAll() {
        var length: number = this._reusablesUsed.length;
        
        for (var i: number = 0; i < length; i++) {
            this._reusablesFree.push(this._reusablesUsed[i]);
        }

        this._reusablesUsed = new Array<Reusable>();
    }
}