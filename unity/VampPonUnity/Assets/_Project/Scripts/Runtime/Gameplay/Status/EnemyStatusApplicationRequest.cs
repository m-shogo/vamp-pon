using System;

namespace VampPon.UnitySpike.Runtime.Gameplay.Status
{
    /// <summary>
    /// Typed, balance-neutral request carried by runtime hit executors.
    /// The request owns no defaults: every numeric/application policy is supplied by the caller.
    /// </summary>
    public readonly struct EnemyStatusApplicationRequest
    {
        public EnemyStatusApplicationRequest(
            EnemyStatusRuntimeKind kind,
            EnemyStatusApplicationPolicy policy)
        {
            Kind = kind;
            Policy = policy;
        }

        public EnemyStatusRuntimeKind Kind { get; }
        public EnemyStatusApplicationPolicy Policy { get; }

        public EnemyStatusApplyResult ApplyTo(EnemyStatusRuntimeState state)
        {
            if (state == null) throw new ArgumentNullException(nameof(state));
            return state.Apply(Kind, Policy);
        }
    }
}
